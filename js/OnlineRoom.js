class OnlineRoom
{
    constructor(Scene)
    {
        const firebaseConfig = {
            apiKey: "AIzaSyAq8QR_Nj1whCJG7x3OCIES3rQQPZ-iut4",
            authDomain: "scarletadventure-c1352.firebaseapp.com",
            databaseURL: "https://scarletadventure-c1352-default-rtdb.firebaseio.com",
            projectId: "scarletadventure-c1352",
            storageBucket: "scarletadventure-c1352.appspot.com",
            messagingSenderId: "596707749632",
            appId: "1:596707749632:web:b8a67f4400616a953dcde5",
            measurementId: "G-78Q62814R9"
          };  
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app();
         }
        this.Room = Math.floor(Math.random() * 10000);
        this.dbRefSala = firebase.database().ref().child(/*"Room:"+this.Room*/"Room");
        var NewRoom = this.dbRefSala.push();
        var position = { x : 1000, y : 200, z : 8550};
        NewRoom.set({position, OwnerRotationy: 180 * 3.1416 / 180, Scene, Room: this.Room});
        this.Players = [];
    }

    GetRoom()
    {
        return this.Room;
    }

    Getdb()
    {
        return this.dbRefSala;
    }

    updateFirebase(currentPlayer,currentKey){
		const dbRefPlayers =  firebase.database().ref().child(`Room/${ currentKey }`);
        dbRefPlayers.update({
             Room: currentPlayer.Room,
			 position: currentPlayer.position,
			 OwnerRotationy: currentPlayer.OwnerRotationy
		})

	} 
}

export {OnlineRoom};