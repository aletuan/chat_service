$(document).ready(function() {
    contactsNamespace.initialize();
});

(function() {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var currentRecord;

    ns.initialize = function () {
        console.log("initialize is called");
        $('#currentAction').html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();
        var results = retrieveFromStorage();
        bindToGrid(results);

        // when button click, then save & refrest again the grid
        $('#btnSave').on('click', ns.save);
        ns.display();
    };

    ns.display = function () {
        $('#currentAction').html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();
        var results = retrieveFromStorage();
        bindToGrid(results);
    };

    ns.loadContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var results = retrieveFromStorage();
        $('#currentAction').html('Edit Contact');
        currentRecord = { key: key, contact: results[key] }
        displayCurrentRecord();
    };

    ns.save = function () {
        var contact = currentRecord.contact;
        contact.firstName = $('#firstName').val();
        contact.lastName = $('#lastName').val();
        contact.email = $('#email').val();
        contact.phoneNumber = $('#phoneNumber').val();
        var results = retrieveFromStorage();
        if (currentRecord.key != null) {
            results[currentRecord.key] = contact;
        } else {
            results.push(contact);
        }
        localStorage.setItem('contacts', JSON.stringify(results));
        ns.display();
    };

    function displayCurrentRecord() {
        var contact = currentRecord.contact;
        $('#firstName').val(contact.firstName);
        $('#lastName').val(contact.lastName);
        $('#email').val(contact.email);
        $('#phoneNumber').val(contact.phoneNumber);
    }

    /*
    function retrieveFromStorage() {
        var contactsJSON = localStorage.getItem('contacts');
        return contactsNamespace ? JSON.parse(contactsJSON) : [];
    }
    */

    function retrieveFromStorage() {
        var contactsJSON = localStorage.getItem('contacts');
        return contactsJSON ? JSON.parse(contactsJSON) : [];
    }

    function bindToGrid(results) {
        var html = '';
        for (var i = 0; i < results.length; i++) {
            var contact = results[i];
            html += '<tr><td>' + contact.email + '</td>';
            html += '<td>' + contact.firstName + ' ' + contact.lastName + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + i + '>Edit</a></td></tr>';
        }
        html = html || '<tr><td colspan="3">No records available</td></tr>';
        $('#contacts tbody').html(html);
    }
})();