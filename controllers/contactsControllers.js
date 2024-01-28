// import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { Contact } from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const result = await Contact.find();
        res.json(result);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        // const result = await Contact.findOne({_id:id});
         const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404);
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404);
        }
        res.json({
            message:'Delete success', result
        })
    } catch (error) {
        next(error)
    }
};

export const createContact = async (req, res, next) => {
    try {

        const result = await Contact.create(req.body);
        res.status(201).json(result)

    } catch (error) {
        next(error)
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, {new:true});
        if (!result) {
            throw HttpError(400, error.message)
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};
export const updateFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            throw HttpError(400, error.message)
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};