import { Meteor } from 'meteor/meteor';

// Creating the Schema for the To-Do List:
Resolutions = new Mongo.Collection('resolutions');

Meteor.startup(() => {
  // code to run on server at startup
});

// Methods on the server side
Meteor.methods({
    addResolution: function(title) {
        Resolutions.insert({
            title: title,
            createdAt: new Date(),
            owner: Meteor.userId()
        });
    },
    updateResolution: function(id, checked) {
        Resolutions.update(id, {$set: {checked: checked}});
    },
    deleteResolution: function(id) {
        Resolutions.remove(id);
    },
    setPrivate: function(id, private) {
        Resolutions.update(id, {$set: {private: private}});
    }
});

// Creates a Publisher for resolutions data
Meteor.publish("resolutions", function () {
    return Resolutions.find({
        $or: [
            { private: {$ne: true} },
            { owner: this.userId}
        ]
    });
});
