// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// function OnlineUsers() {
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     socket.on('onlineUsers', (users) => {
//       setOnlineUsers(users);
//     });

//     return () => {
//       socket.off('onlineUsers');
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Online Users</h2>
//       <ul>
//         {onlineUsers.map(user => <li key={user}>{user}</li>)}
//       </ul>
//     </div>
//   );
// }

// export default OnlineUsers;
