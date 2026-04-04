'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

exports.getAllBanks = async (req, res, next) => {
  try {
    const banks = await db.QuestionBank.findAll({
      include: [{ model: db.User, as: 'creator', attributes: ['user_id','username','fullName','role'] }]
    });
    res.json({ banks });
  } catch (err) {
    next(err);
  }
};

exports.getBankById = async (req, res, next) => {
  try {
    const bank = await db.QuestionBank.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id','username','fullName','role'] },
        { model: db.Question, include: [db.Answer, { model: db.QuestionType, as: 'type' }] }
      ]
    });
    if (!bank) return res.status(404).json({ message: 'khong tim thay ngan hang' });
    res.json({ bank });
  } catch (err) {
    next(err);
  }
};

exports.createBank = async (req, res, next) => {
  try {
    const creator_id = req.user?.user_id || req.body.creator_id;
    const { bankName } = req.body;

    const bank = await db.QuestionBank.create({ bankName, creator_id });
    res.status(201).json({ message: 'tao ngan hang thanh cong', bank });
  } catch (err) {
    next(err);
  }
};

exports.updateBank = async (req, res, next) => {
  try {
    const bank = await db.QuestionBank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: 'khong tim thay ngan hang' });

    if (!isAdmin(req) && req.user?.user_id && bank.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat ngan hang nay' });
    }

    await bank.update({ bankName: req.body.bankName ?? bank.bankName });
    res.json({ message: 'cap nhat thanh cong', bank });
  } catch (err) {
    next(err);
  }
};

exports.deleteBank = async (req, res, next) => {
  try {
    const bank = await db.QuestionBank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: 'khong tim thay ngan hang' });

    if (!isAdmin(req) && req.user?.user_id && bank.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa ngan hang nay' });
    }

    await bank.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

exports.addQuestionToBank = async (req, res, next) => {
  try {
    const bank = await db.QuestionBank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: 'khong tim thay ngan hang' });

    if (!isAdmin(req) && req.user?.user_id && bank.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen them cau hoi vao ngan hang' });
    }

    const { question_id } = req.body;

    const q = await db.Question.findByPk(question_id);
    if (!q) return res.status(404).json({ message: 'khong tim thay cau hoi' });

    const existed = await db.BankQuestion.findOne({ where: { bank_id: bank.bank_id, question_id } });
    if (existed) return res.status(409).json({ message: 'cau hoi da co trong ngan hang' });

    const row = await db.BankQuestion.create({ bank_id: bank.bank_id, question_id });
    res.status(201).json({ message: 'them cau hoi vao ngan hang thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};
