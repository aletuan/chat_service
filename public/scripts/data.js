// cross browser friendly fixing
window.indexedDB = window.indexedDB || window.mozIndexedDB
      || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

// get request file system depending on Chrome versions
window.requestFileSystem  = window.requestFileSystem ||
      window.webkitRequestFileSystem;



$(document).ready(function() {
    contactsNamespace.initialize();
});

(function() {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var db;
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

        // initialize database
        //db = openDatabase("Library", "5.0", "My library", 5 * 1024 * 1024);
        // change version
        //db.changeVersion("4.0", "5.0", migrateDB, onError, onSuccess);
        // display current version
        //console.log("Current schema: " + db.version);

        // insert data
        //insertDatabase("Tuan Anh", "Le");
        //insertDatabase("Mai Huong ", "Le");
        //insertDatabase("Tuan Anh", "Le");

        // get and show data size
        //getRecords();
        var indexedDB = window.indexedDB;
        // open database
        var openRequest = indexedDB.open('Library', 2);
        var db;

        openRequest.onupgradeneeded = function(response) {
            console.log("onupgradedneeded is called");
            response.currentTarget.result.createObjectStore("authors", 
        {
            keypath: 'id',
            autoIncrement: true
        });
        };

        openRequest.onsuccess = function(response) {
            console.log("IndexDB open success");
            db = openRequest.result;
            //addAuthors();
            getAuthor();
        };

        openRequest.onerror = function(response) {
            console.log("IndexDB open error");            
        };

        function getAuthor() {
            console.log("getAuthor is called");
            var trans = db.transaction("authors", "readonly");
            var authors = trans.objectStore("authors");
            var request = authors.get(1);

            request.onsuccess = function(response) {
                var author = response.target.result;
                console.log("last name " + author.lastName);
            }
        }

        function addAuthors() {
            console.log("AddAuthors is called");
            var trans = db.transaction('authors', 'readwrite');
            var authors = trans.objectStore('authors');
            var request = authors.add({firstName: "Daniel", lastName: "Defoe"});

            request.onsuccess = function(response) {
                console.log("adding new object is successed");
            };

            request.onerror = function(response) {
                console.log("removing object has error");
            };
        }

    };

    function insertDatabase(firstName, lastName) {
        console.log("insert database is called");
        db.transaction(function (t) {
            t.executeSql("INSERT INTO authors(firstName, lastName) VALUES(?,?)", [firstName, lastName], itemInserted);
        });
    }

    function getRecords() {
        console.log("getRecords function is called");
        db.transaction(function(t){
            t.executeSql("SELECT * FROM authors", [], displayResults)
        });
    }

    function displayResults(transaction, results) {
        console.log(results.rows.length);
        //console.log("Number of record " + results.rows.length);
        for (var i = 0; i < results.rows.length; i++) {
            var item = results.rows.item(i);
            $('#items').append('<li>' + item.firstName + " " + item.lastName + "</li>");
        }
    }

    function itemInserted(transaction, results) {
        console.log("Id: " + results.getInsertId);
    }

    ns.display = function () {
        $('#currentAction').html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();
        var results = retrieveFromStorage();
        bindToGrid(results);
    };

    ns.loadContact = function () {
        console.log("loadContact is called");
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
        $('#contacts a.edit').on('click', ns.loadContact);
    }

    // using web sql in chrome
    function migrateDB(transaction) {
        transaction.executeSql("CREATE TABLE IF NOT EXISTS authors(" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "firstName TEXT, "+
                    "lastName TEXT, " +
                    "dateCreated TIMESTAMP DEFAULT(datetime('now', 'localtime')))");
    }

    function onError(error) {
        alert("Error code: " + error.code + " Message: " + error.message);
    }

    function onSuccess(error) {
        alert("Migration complete");
    }

})();