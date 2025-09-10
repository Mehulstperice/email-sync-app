const express = require('express');
const router = express.Router();
const ImapAccount = require('../models/imapAccount');
const imapService = require('../services/imapService');

router.post('/save', async (req, res) => {
  try {
    const accountData = req.body;
    let account = await ImapAccount.findOne({ accountId: accountData.accountId });
    if (account) {
      Object.assign(account, accountData);
    } else {
      account = new ImapAccount(accountData);
    }
    await account.save();
    res.json({ message: 'Account saved', account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const accounts = await ImapAccount.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/connect', async (req, res) => {
  try {
    const { accountId, config } = req.body;
    await imapService.connect(accountId, config);
    res.json({ message: `Connected to ${accountId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    const { accountId } = req.body;
    await imapService.disconnect(accountId);
    res.json({ message: `Disconnected from ${accountId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Incremental sync mailbox
router.post('/:accountId/mailboxes/:mailboxName/sync', async (req, res) => {
  try {
    const { accountId, mailboxName } = req.params;
    const result = await imapService.incrementalSync(accountId, mailboxName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search emails in mailbox with pagination
router.get('/:accountId/mailboxes/:mailboxName/emails', async (req, res) => {
  try {
    const { accountId, mailboxName } = req.params;
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const emails = await imapService.fetchEmailsFromDb(accountId, mailboxName, q, skip, parseInt(limit));
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch full email by UID
router.get('/:accountId/mailboxes/:mailboxName/emails/:uid', async (req, res) => {
  try {
    const { accountId, mailboxName, uid } = req.params;
    const email = await imapService.fetchEmailContent(accountId, mailboxName, parseInt(uid));
    if (!email) return res.status(404).json({ error: 'Email not found' });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
