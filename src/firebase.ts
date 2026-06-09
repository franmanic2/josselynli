import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAdRx7-4qjgXBf29VnXe1FcUwysWN4tCaQ',
  authDomain: 'josselynli.firebaseapp.com',
  projectId: 'josselynli',
  storageBucket: 'josselynli.firebasestorage.app',
  messagingSenderId: '727373076017',
  appId: '1:727373076017:web:006e9c2b9b5af9ddf26710',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
