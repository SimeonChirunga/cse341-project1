const mongodb = require('../data/database');
const {ObjectId} = require('mongodb');

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });
};

const getSingle = async (req, res) => {
    
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId});
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};


const createContact = async (req, res) => {
    //#swagger.tags=['Contacts']
    /*  #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Contact information',
            required: true,
            schema: {
                firstName: 'Simeon',
                lastName: 'Chirunga',
                email: 'test@example.com',
                favouriteColor: 'Blue',
                birthday: '1977-06-211'
            }
    } */
    
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favouriteColor: req.body.favouriteColor,
        birthday: req.body.birthday
    };
    
    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Sorry, some error occurred while creating the contact.');
    }
};

const updateContact = async (req, res) => {
    //#swagger.tags=['Contacts']
    const contactId = new ObjectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favouriteColor: req.body.favouriteColor,
        birthday: req.body.birthday

    };
    const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({_id: contactId}, contact);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Sorry, some error occured while updating the contact.');
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tags=['Contacts']
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({_id: contactId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Sorry, some error occured while deleting the contact.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};