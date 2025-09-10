const { ImapFlow } = require('imapflow');
const MailParser = require('mailparser').MailParser;
const Email = require('../models/email');

class ImapService {
  constructor() {
    this.connections = new Map();
  }

  async connect(accountId, config) {
    if (this.connections.has(accountId)) return;

    const client = new ImapFlow({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
    client.on('error', err => console.error('IMAP error:', err));
    await client.connect();
    this.connections.set(accountId, client);
  }

  async disconnect(accountId) {
    const client = this.connections.get(accountId);
    if (client) {
      await client.logout();
      this.connections.delete(accountId);
    }
  }

  async fetchMailboxes(accountId) {
    const client = this.connections.get(accountId);
    if (!client) throw new Error('Not connected');

    const mailboxes = [];
    for await (let mailbox of client.list()) {
      mailboxes.push(mailbox);
    }
    return mailboxes;
  }

  async incrementalSync(accountId, mailboxName) {
    const client = this.connections.get(accountId);
    if (!client) throw new Error('Not connected');

    await client.selectMailbox(mailboxName);

    const lastEmail = await Email.findOne({ accountId, mailbox: mailboxName }).sort({ uid: -1 }).exec();
    const lastUID = lastEmail ? lastEmail.uid : 0;

    const messages = [];
    for await (let message of client.fetch(`${lastUID + 1}:*`, { uid: true, source: true, envelope: true, flags: true })) {
      messages.push(message);
    }

    for (const msg of messages) {
      try {
        const parsed = await this.parseEmail(msg.source);
        const emailDoc = {
          accountId,
          mailbox: mailboxName,
          uid: msg.uid,
          subject: parsed.subject,
          from: parsed.from?.value,
          to: parsed.to?.value,
          date: parsed.date,
          flags: msg.flags,
          html: parsed.html,
          text: parsed.text,
          raw: msg.source.toString(),
        };
        await Email.updateOne(
          { accountId, mailbox: mailboxName, uid: msg.uid },
          emailDoc,
          { upsert: true }
        );
      } catch (err) {
        console.error(`Failed to parse/store email UID ${msg.uid}:`, err);
      }
    }
    return { newEmails: messages.length };
  }

  parseEmail(source) {
    return new Promise((resolve, reject) => {
      const mailparser = new MailParser();
      mailparser.on('error', reject);
      mailparser.on('end', resolve);
      mailparser.write(source);
      mailparser.end();
    });
  }

  async fetchEmailsFromDb(accountId, mailboxName, searchQuery, skip = 0, limit = 20) {
    const filter = { accountId, mailbox: mailboxName };
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }
    return Email.find(filter).sort({ date: -1 }).skip(skip).limit(limit).exec();
  }

  async fetchEmailContent(accountId, mailboxName, uid) {
    return Email.findOne({ accountId, mailbox: mailboxName, uid }).exec();
  }
}

module.exports = new ImapService();
