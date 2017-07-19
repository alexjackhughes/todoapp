import './main.html'; // imports main.html into 'client' i.e. front-end
Meteor.subscribe("resolutions"); // Subscribes to publisher 'resolutions'

// Creating the Schema for the To-Do List:
Resolutions = new Mongo.Collection('resolutions');

// Helper Methods:
Template.body.helpers({
    // Checks whether task has been finished
    resolutions: function() {
        if (Session.get('hideFinished')) {
            return Resolutions.find({checked: {$ne: true}});
        } else {
            return Resolutions.find();
        }
    },
    // Hides all finished tasks
    hideFinished: function() {
        return Session.get(hideFinished);
    }
});

// Methods for interaction with resolution:
Template.resolution.events({
    // update whether task has been completed or notx
    'click .toggle-checked': function() {
        Meteor.call('updateResolution', this._id, !this.checked);
    },
    // Deletes task
    'click .delete': function() {
        Meteor.call('deleteResolution', this._id);
    },
    // Toggles whether task was private or public
    'click .toggle-private': function() {
        Meteor.call('setPrivate', this._id, !this.checked);
    }
});

Template.resolution.helpers({
    // Method to check whether user is person who created content:
    isOwner: function() {
        return Template.instance().data.owner === Meteor.userId();
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

// Methods for interaction with html by user:
Template.body.events({
    //
    'submit .new-resolution': function(event) {
        var title = event.target.title.value;

        Meteor.call("addResolution", title);

        event.target.title.value = "";

        return false;
    },
    'change .hide-finished': function(event) {
        Session.set('hideFinished', event.target.checked);
    }
});
