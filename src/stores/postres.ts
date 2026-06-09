import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebase'

export interface Postre {
  id: string
  nombre: string
  categoria: string
  precio: number
  imagenUrl: string
  creadoEn: Timestamp
}

export const usePostresStore = defineStore('postres', () => {
  const postres = ref<Postre[]>([])
  let unsub: Unsubscribe | null = null

  function startListening() {
    unsub = onSnapshot(collection(db, 'postres'), (snap) => {
      postres.value = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Postre))
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addPostre(data: {
    nombre: string
    categoria: string
    precio: number
    imagenUrl: string
  }) {
    await addDoc(collection(db, 'postres'), {
      ...data,
      creadoEn: Timestamp.now(),
    })
  }

  async function updatePostre(
    id: string,
    data: { nombre: string; categoria: string; precio: number; imagenUrl: string },
  ) {
    await updateDoc(doc(db, 'postres', id), { ...data })
  }

  async function deletePostre(id: string) {
    await deleteDoc(doc(db, 'postres', id))
  }

  return { postres, startListening, stopListening, addPostre, updatePostre, deletePostre }
})
