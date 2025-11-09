import { Injectable, Testability } from '@angular/core';
import axios from 'axios';
import { Resp } from '../interfaces/response';
import { Messages } from '../messagecontroller';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  SERVER = 'http://localhost:3000'

  constructor() {
  }

  async selectAll(table: string): Promise<Resp> {
    try {
      const res = await axios.get(`${this.SERVER}/${table}`)
      return {
        status: 200,
        data: res.data

      }
    } catch (err) {
      console.log(err)
      return {
        status: 200,
        data: err

      }

    }
  }

  async select(table: string, type: number | string): Promise<Resp> {
    try {
      const res = await axios.get(`${this.SERVER}/${table}/${type}`)
      return {
        status: 200,
        data: res.data
      }
    } catch (err) {
      return {
        status: 200,
        data: Messages('danger', 'Hiba!', 'Hiba történt a kategória törlésekor!')
      }
    }
  }

  async postNew(table: string, data: any) {
    try {
      const res = await axios.post(
        `${this.SERVER}/${table}`,
        data, // api kérés
        { headers: { 'Content-Type': 'application/json' } })
      return {
        status: 200,
        message: 'A rekord felvéve',
        data: res.data
      }
    } catch (err) {
      return {
        status: 200,
        message: 'Hiba a felvételben',
        data: err
      }
    }
  }

  async update(table: string, id: number, data: any) {
    try {
      const res = await axios.patch(
        `${this.SERVER}/${table}/${id}`,
        data, // api kérés
        { headers: { 'Content-Type': 'application/json' } })
      return {
        status: 200,
        data: res.data
      }
    } catch (err) {
      return {
        status: 200,
        data: Messages('danger', 'Hiba!', 'Hiba történt a kategória törlésekor!')
      }
    }
  }

  async delete(table: string, id: number): Promise<Resp> {
    try {
      const res = await axios.delete(`${this.SERVER}/${table}/${id}`)
      return {
        status: 200,
        data: res.data
      }
    } catch (err) {
      return {
        status: 200,
        data: Messages('danger', 'Hiba!', 'Hiba történt a kategória törlésekor!')
      }
    }
  }

  async deleteAll(table: string): Promise<Resp> {
    try {
      const res = await axios.delete(`${this.SERVER}/${table}`)
      return {
        status: 200,
        data: ""
      }
    } catch (err) {
      return {
        status: 200,
        data: Messages('danger', 'Hiba!', 'Hiba történt a kategória törlésekor!')
      }
    }
  }
}