export class RaceService {
  constructor() {}

  public async startRace(trackId: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:3000/races/${trackId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to start race");
      }
    } catch (error) {
      console.error("Error starting race:", error);
      throw error;
    }
  }

  public async stopRace(trackId: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:3000/races/${trackId}/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to stop race");
      }
    } catch (error) {
      console.error("Error stopping race:", error);
      throw error;
    }
  }
}
