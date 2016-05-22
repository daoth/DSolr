var solr = require('solr-client');
var figc = require('figc');
//var client = solr.createClient('redmine.choiweb.xyz', 8983, 'testdata2', '/solr');
//var client2 = solr.createClient('localhost', 8983, 'topic_12881', '/solr');

//node solr.js doc add topic_12881 data\doc.json
//node solr.js doc del topic_12881 id users_1

var DSolr = {
	_client:null,
	_config:null,
	startClient:function(config){
		this._config = figc('config.json');
		if(typeof(config) == 'object' && config.core){
			this._config.client.core=config.core;
		}
		
		this._client = solr.createClient(this._config.client);
	},
	createCollection:function(name){
		console.log(this._client.options);
		var collection = this._client.collection();
		collection.create(
			{
				name: name,
				numShards: 1,
				replicationFactor: 1,
				maxShardsPerNode: 1,
				collectionConfigName: "datacenter",
				autoAddReplicas: 'false'
			}
		);
		this._client.executeCollection(collection,function(err,data){
			console.log(err,data);
		});
	},
	deleteCollection:function(name){
		var collection = this._client.collection();
		collection.delete(name);
		this._client.executeCollection(collection,function(err,data){
				console.log(err,data);
		});
	},
	addDocument:function(data){
		options = {commit:true};
		this._client.add(data,options,function(err,obj){
			if(err){
				console.log(err);
			}else{
				console.log('Solr response:', obj);
			}
		});
		
	},
	deleteDocument:function(field,query){
		options = {commit:true};
		this._client.delete(field,query,options,function(err,obj){
		   if(err){
			console.log(err);
		   }else{
			console.log(obj);	
		   }
		}); 
	},
	deleteAll:function(){
		options = {commit:true};
		this._client.deleteAll(options,function(err,obj){
			if(err){
				console.log(err);
			}else{
				console.log(obj);
			}
		});
	}
};

var type = process.argv[2];
var cmd = process.argv[3];
if(type=='collection' || type=='col'){
	var my = DSolr;
	my.startClient();
	if(cmd=='create'){
		my.createCollection(process.argv[4]);
	}else if(cmd=='del'){
		my.deleteCollection(process.argv[4]);
	
	}


}
else if(type=='doc') {
	var config={
		core:process.argv[4]
	}

	DSolr.startClient(config);
	if(cmd=='add'){
		var doc = process.argv[5];
		var fs = require('fs');
		var data = fs.readFileSync(doc);
		var docs = JSON.parse(data.toString());
		
		var mydata = [];
		for(i in docs){
			mydata[i] = docs[i];
			delete(mydata[i]._version_);
			if(i==10){
				break;
			}
		}
		console.log(mydata);
		DSolr.addDocument(mydata);
		
		//DSolr.addDocument(docs);
	}
	else if(cmd=='del'){
		var field=process.argv[5];
		var query=process.argv[6];
		DSolr.deleteDocument(field,query);
	}
	else if(cmd=='delall'){
		DSolr.deleteAll();
	
	}
}


return;
if (cmd == 'query') {
	var query = process.argv[3];
	search(client,query);
}


return;


function search(client, query) {
	client.search('shards.tolerant=true&q='+query, function(err, obj){
		if(!err) {
			docs = obj.response.docs;
			for(i in docs) {
				console.log(docs[i].hoten);
			}
			//console.log(obj.response);
		}
        //console.log(err, obj);
    });
}




process.exit(1);

