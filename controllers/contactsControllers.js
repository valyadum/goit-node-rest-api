import contactsService from "../services/contactsServices.js";
// import express from "express";

// const router = express.Router();
export const getAllContacts = async (req, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
