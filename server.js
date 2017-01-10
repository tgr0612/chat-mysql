var mysql = require('mysql');
var io = require('socket.io').listen(3000)
var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '123456',
  database : 'node'
});

db.connect(function(err){
  if(err) console.log(err)
});


var note = []
var isInitNotes = false
var socketCount = 0

io.sockets.on('connection', function(socket){
  // Socket has connected, increase socket count
  socketCount++
  // Let all sockets know how many are connected
  io.sockets.emit('users connected', socketCount)

  socket.on('disconnect', function(){
    //Decrease the socket count on a disconnect, emit
    socketCount--
    io.scokets.emit('users connected', socketCount)
  })

  socket.on('new note', function(data){
    //New note added, push to all sockets and insert into db
    notes.push(data)
    io.sockets.emit('new note', dat)
    //Use node's db injection forma to filter incoming data
    db.query('INSERT INTO notes (note) VALUES (?)', data.note)
  })

  if (! isInitNotes) {
      // Initial app start, run db query
      db.query('SELECT * FROM notes')
          .on('result', function(data){
              // Push results onto the notes array
              notes.push(data)
          })
          .on('end', function(){
              // Only emit notes after query has been completed
              socket.emit('initial notes', notes)
          })

      isInitNotes = true
  } else {
      // Initial notes already exist, send out
      socket.emit('initial notes', notes)
  }


})
