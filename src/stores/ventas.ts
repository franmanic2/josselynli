import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebase'

export interface Venta {
  id: string
  postreId: string
  nombrePostre: string
  imagenUrl: string
  precioVenta: number
  nombreCliente: string
  fechaRegistro: Timestamp
  fechaEntrega: Timestamp
  estado: 'pendiente' | 'entregado'
}

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref<Venta[]>([])
  let unsub: Unsubscribe | null = null

  function startListening() {
    unsub = onSnapshot(collection(db, 'ventas'), (snap) => {
      ventas.value = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Venta))
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addVenta(data: {
    postreId: string
    nombrePostre: string
    imagenUrl: string
    precioVenta: number
    nombreCliente: string
    fechaEntrega: Date
  }) {
    await addDoc(collection(db, 'ventas'), {
      ...data,
      fechaRegistro: Timestamp.now(),
      fechaEntrega: Timestamp.fromDate(data.fechaEntrega),
      estado: 'pendiente',
    })
  }

  async function markAsDelivered(id: string) {
    await updateDoc(doc(db, 'ventas', id), { estado: 'entregado' })
  }

  return { ventas, startListening, stopListening, addVenta, markAsDelivered }
})
