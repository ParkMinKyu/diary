/*!
 * indexedDB Plugin v0.0.1
 * License: https://github.com/ParkMinKyu/diary/blob/master/LICENSE
 * (c) 2017 niee
 */
var IndexedDB = {
		indexedDB : window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB, 
		schemaName: null,
		dataBaseName: null,
		checkDB : function(){
			if (!this.indexedDB) {
			    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
			} else{
				console.log("Your browser does support a indexedDB");
			}
		},
		getConnection : function(version){
			if(!this.dataBaseName)this.dataBaseName = "SmapleDataBase";
			if(!version)version = 1;
			var database = this.indexedDB.open(this.dataBaseName, version);
			return database;
		},
		createSchema: function(id){
			if(!this.schemaName)this.schemaName="SampleSchema";
			var database = this.getConnection();
			database.onupgradeneeded = function(){
				var db = database.result;
				var store = db.createObjectStore(IndexedDB.schemaName, {keyPath: id});
				var index = store.createIndex("keyIndex", id);
			}
		},
		selectOne : function(id,callback){
			var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IndexedDB.schemaName, "readonly");
				var store = tx.objectStore(IndexedDB.schemaName);
				
				var data = store.get(id);
				
				data.onsuccess = function(){
					callback(data.result);
				}
				
				tx.oncomplete = function() {
			        db.close();
			    };
			}
			
			database.onerror = function(event){
				callback(event);
			}
		},
		selectAll : function(callback){
			var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IndexedDB.schemaName, "readonly");
				var store = tx.objectStore(IndexedDB.schemaName);
				
				var data = store.getAll();
				
				data.onsuccess = function(){
					callback(data.result);
				}
				
				tx.oncomplete = function() {
			        db.close();
			    };
			}
			
			database.onerror = function(event){
				callback(event);
			}
		},
		selectMaxValue: function(indexName, callback){
			var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IndexedDB.schemaName, "readonly");
				var store = tx.objectStore(IndexedDB.schemaName);
				var index = store.index(indexName);
				var cursor = index.openCursor(null, 'prev');
				var obj = null;
				
				cursor.onsuccess = function (event) {
					if (event.target.result) {
						obj = event.target.result.value; //the object with max revision
					}
				};
				
				tx.oncomplete = function() {
			        db.close();
			        callback(obj);
			    };
			}
			
			database.onerror = function(event){
				callback(event);
			}
		},
		insert: function(val, callback){
			var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IndexedDB.schemaName, "readwrite");
				var store = tx.objectStore(IndexedDB.schemaName);
				
				store.put(val);
				
				tx.oncomplete = function() {
			        db.close();
			    };
			    
			    callback(1);
			}
			
			database.onerror = function(event){
				callback(event);
			}
		},
		delete: function(id,callback){
			var database = this.getConnection();
			database.onsuccess = function() {
				var db = database.result;
				var tx = db.transaction(IndexedDB.schemaName, "readwrite");
				var store = tx.objectStore(IndexedDB.schemaName);
				
				store.delete(id);
				
				tx.oncomplete = function() {
			        db.close();
			        callback(1);
			    };
			}
			
			database.onerror = function(event){
				callback(event);
			}
		}
};