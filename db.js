var mysql = require('mysql');
var db_config = {
  host: 'localhost',
  user: 'root',
  password: 'dbpw',
  database: 'dbname'
};

var connection;

function handleDisconnect(){
    connection = mysql.createConnection(db_config);

    connection.connect(function(err){
        if(err){
            console.log('error when connecting to db: ' , err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err){
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    });
}

handleDisconnect();

exports.connection = connection;

function conditionjoin(conditions){
  var condition="";
  var count = 0;
  var size = Object.keys(conditions).length - 1;
  for(var i in conditions){
    if(typeof conditions[i] === "number"){
      condition = condition + i + " = " + conditions[i];
    }
    else{
      if(conditions[i].split(",").length != 1 )
        condition = condition + i + " in(" + conditions[i] + ")";
      else
        condition = condition + i + " in( \'" + conditions[i].replace(/\'/g, "") + "\')";
    }
    if(count == size){
      return condition;
    }
    else{
      count++;
      condition = condition + " AND ";
    }
  }
}

exports.Insert = function Insert(table,data,callback){
  var sql = "INSERT INTO " + table + " SET ? ";
  console.log(sql);
  console.log("Data: {");
  for(var i in data){
    console.log(i+" : "+data[i]);
  }
  console.log("}");
  connection.query(sql,data,function(err,results){
    if (err) throw err;
    console.log("Create success");
    callback(err,results);
  });
}

exports.GetAll = function GetAll(table,order,callback){
  var sql = "SELECT * FROM " + table + " ORDER BY " + order['column'] + " " + order['order'] ;
  console.log(sql);
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    callback(results);
  });
}

exports.Update = function Update(table,datas,conditions,callback){
  var condition = conditionjoin(conditions);
  var data="";
  count = 0;
  size = Object.keys(datas).length - 1;
  for(var i in datas){
    if(typeof datas[i] === "number"){
      data = data + i + " = " + datas[i];
    }
    else{
      data = data + i + " = \'" + datas[i] + "\'";
    }
    if(count == size){
      break;
    }
    else{
      count++;
      data = data + ",";
    }
  }
  var sql = "UPDATE " + table + " SET " + data + " WHERE " + condition;
  console.log(sql);
  console.log("Data: {");
  for(var i in datas){
    console.log(i+" : "+datas[i]);
  }
  console.log("}");
  connection.query(sql,function(err,results){
    if (err) throw err;
    callback(results);
  });
}

exports.FindbyID = function FindbyID(table,id,callback){
  var sql = "SELECT * FROM " + table +" WHERE id = "+ id;
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    callback(results[0]);
  });
}

exports.FindbyColumn = function FindbyColumn(table,cols,conditions,callback){
  var columns = "";
  for(var i in cols ){
    columns+=cols[i];
    if( i != cols.length-1 ){
      columns+=",";
    }
  }
  var condition = conditionjoin(conditions);
  var sql = "SELECT " + columns + " FROM " + table + " WHERE " + condition;
  console.log(sql);
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    callback(results);
  });
}

exports.DeleteById = function DeleteById(table,id,callback){
  var sql = "DELETE FROM " + table + " WHERE id = " + id;
  console.log(sql);
  connection.query(sql,function(err,results){
    if (err) throw err;
    console.log("DELETE Success!");
    callback(err);
  });
}
