import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp(functions.config().firebase);

exports.Notification = functions.database.ref('mensajes/{uid}/').onCreate((event)=>{

//obtener tokens -----------------------------------------------------------------
var x=event.val();
//console.log(x);

 const query = admin.database().ref("/tokens").orderByChild('uid');

 query.once("value")
   .then(function(snapshot) {
     //var t=[];
     var ArrayTokens:any=[];

     snapshot.forEach(function(childSnapshot) {
       // key will be "ada" the first time and "alan" the second time
       //var key = childSnapshot.key;

    
       // childData will be the actual contents of the child
       var childData = childSnapshot.val();
      // t.push(childData.token);
        let token:string=childData.token;
        console.log("Token string:"+token);
       ArrayTokens.push(token);
  });

  
  let tipo:string=x.tipo;
  let nombre=Buffer.from(x.nombre,'base64').toString();
  let mensaje=Buffer.from(x.mensaje,'base64').toString();

  if(tipo.localeCompare('texto')===0){
  const payload = {
    notification: {
    title: nombre,
    body:mensaje ,
    }
    
    }
  
                      
    admin.messaging().sendToDevice(ArrayTokens,payload)
    .then((response:any) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error:any) => {
      console.log('Error sending message:', error);
    });
  }

  if(tipo.localeCompare('link')===0){
    const payload = {
      notification: {
      title: nombre,
      body: nombre+' envio un link' ,
      }
      
      }
    
                        
      admin.messaging().sendToDevice(ArrayTokens,payload)
      .then((response:any) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error:any) => {
        console.log('Error sending message:', error);
      });
    }


    if(tipo.localeCompare('foto')===0){
      const payload = {
        notification: {
        title: nombre,
        body: nombre+' envio una foto' ,
        }
        
        }
      
                          
        admin.messaging().sendToDevice(ArrayTokens,payload)
        .then((response:any) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error:any) => {
          console.log('Error sending message:', error);
        });
      }
  
 }).catch(e=>{
   console.log(e);
 });
//---------------------------------------------------------------------------------

});

exports.SalaNotificacion = functions.database.ref('salas/TiempoReal/{uid}').onCreate((event)=>{


  var x=event.val();
  console.log(x);
  const mensajeRef=admin.database().ref().child('salas').child(x.liga).child('mensajes').child(x.mensaje);
  const tokenRef=admin.database().ref().child('salas').child(x.liga).child('tokens').orderByChild('uid');
  mensajeRef.once('value').then(e=>{
   const msj=JSON.parse(JSON.stringify(e));
  console.log('e sin nada:'+JSON.stringify(e));
  console.log('e con json:'+e.toJSON);
  console.log('mensaje'+e.val());

 tokenRef.once("value")
 .then(function(snapshot) {
   //var t=[];
   var ArrayTokens:any=[];

   snapshot.forEach(function(childSnapshot) {
     // key will be "ada" the first time and "alan" the second time
     //var key = childSnapshot.key;

  
     // childData will be the actual contents of the child
     var childData = childSnapshot.val();
    // t.push(childData.token);
      let token:string=childData.token;
      //console.log("Token string:"+token);
     ArrayTokens.push(token);
});


let nombre=Buffer.from(msj.nombre,'base64').toString();
let mensaje=Buffer.from(msj.mensaje,'base64').toString();

if(msj.tipo.localeCompare('texto')===0){
const payload = {
  notification: {
  title: msj.sala.toString(),
  body:nombre+':'+mensaje ,
  }
  
  }

                    
  admin.messaging().sendToDevice(ArrayTokens,payload)
  .then((response:any) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error:any) => {
    console.log('Error sending message:', error);
  });
}

if(msj.tipo.localeCompare('link')===0){
  const payload = {
    notification: {
    title:  msj.sala,
    body: nombre+' envio un link' ,
    }
    
    }
  
                      
    admin.messaging().sendToDevice(ArrayTokens,payload)
    .then((response:any) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error:any) => {
      console.log('Error sending message:', error);
    });
  }


  if(msj.tipo.localeCompare('foto')===0){
    const payload = {
      notification: {
      title: msj.sala,
      body: nombre+' envio una foto' ,
      }
      
      }
    
                        
      admin.messaging().sendToDevice(ArrayTokens,payload)
      .then((response:any) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error:any) => {
        console.log('Error sending message:', error);
      });
    }

}).catch(error=>{
 console.log(error);
});


}).catch(e=>{console.log(e)});


});
