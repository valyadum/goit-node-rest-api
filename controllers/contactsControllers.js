// import contactsService from "../services/contactsServices.js";
import {HttpError} from "../helpers/HttpError.js";
import { Contact } from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { page = 1, limit = 20} = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({owner}, "", { skip, limit:Number(limit)});
        res.json(result);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findOne({_id:id}).where("owner").equals(owner);
        // const result = await Contact.findById(id);
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
        const { _id: owner } = req.user;
        const result = await Contact.findByIdAndDelete(id).where("owner").equals(owner);
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
        const { _id: owner } = req.user;
        const result = await Contact.create({...req.body, owner});
        res.status(201).json(result)

    } catch (error) {
        next(error)
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true }).where("owner").equals(owner);
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
        const { _id: owner } = req.user;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true }).where("owner").equals(owner);
        if (!result) {
            throw HttpError(400, error.message)
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};