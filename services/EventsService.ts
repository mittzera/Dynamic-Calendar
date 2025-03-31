"use client";
import { IEvent } from "@/interfaces/Event";
import { ServiceResponse } from "@/interfaces/Service";
import { api as apiService, ApiService, defaultUrl } from "./Api";

class EventsService {
  constructor(private readonly api: ApiService) {}

  public async getEvents(): Promise<ServiceResponse<IEvent[]>> {
    try {
      const response = await this.api.get(`${defaultUrl}/games`);
      if (!response) {
        throw new Error(`Erro ao buscar eventos`);
      }
      return {
        content: response as IEvent[],
        status: 200,
        ok: true,
      };
    } catch (error) {
      return {
        content: [],
        error: `Erro ao buscar eventos: ${error}`,
        status: 500,
        ok: false,
      };
    }
  }
}

export const eventService = new EventsService(apiService);
