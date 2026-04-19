import { describe, it, expect, vi, beforeEach } from "vitest";
import EmailApiService from "./email.api-service";
import { EmailEndpoints } from "./email.api.endpoints";

const endpoints = new EmailEndpoints();

describe("EmailApiService", () => {
  let service: EmailApiService;

  beforeEach(() => {
    service = EmailApiService.getInstance();
  });

  describe("singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = EmailApiService.getInstance();
      const instance2 = EmailApiService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("endpoints configuration", () => {
    it("should have index endpoint", () => {
      const serviceEndpoints = (service as any).endpoints;
      expect(serviceEndpoints.index).toBe(endpoints.index);
    });

    it("should have show endpoint as string", () => {
      const serviceEndpoints = (service as any).endpoints;
      expect(typeof serviceEndpoints.show).toBe("string");
      expect(serviceEndpoints.show).toBe(endpoints.show);
    });

    it("should have create endpoint (mapped from store)", () => {
      const serviceEndpoints = (service as any).endpoints;
      // The service maps EmailEndpoints.store → endpoints.create
      expect(serviceEndpoints.create).toBe(endpoints.store);
    });

    it("should have update endpoint as string", () => {
      const serviceEndpoints = (service as any).endpoints;
      expect(typeof serviceEndpoints.update).toBe("string");
      expect(serviceEndpoints.update).toBe(endpoints.update);
    });

    it("should have delete endpoint as string", () => {
      const serviceEndpoints = (service as any).endpoints;
      expect(typeof serviceEndpoints.delete).toBe("string");
      expect(serviceEndpoints.delete).toBe(endpoints.delete);
    });
  });

  describe("executeEmailAction", () => {
    it("should call customPost with correct endpoint and params", async () => {
      const mockParams = { email: "test@example.com" };
      const mockResponse = {
        data: {
          data: { id: 1, email: "test@example.com" },
          status: true,
          message: "Success",
        },
        statusCode: 200,
      };

      // Spy on customPost method
      const customPostSpy = vi
        .spyOn(service as any, "customPost")
        .mockResolvedValue(mockResponse);

      const result = await service.executeEmailAction(mockParams as any);

      expect(customPostSpy).toHaveBeenCalledWith(endpoints.store, mockParams);
      expect(result).toEqual(mockResponse);

      customPostSpy.mockRestore();
    });

    it("should use store endpoint for executeEmailAction", async () => {
      const mockParams = { email: "action@example.com" };
      const mockResponse = {
        data: {
          data: { id: 2, email: "action@example.com" },
          status: true,
          message: "Success",
        },
        statusCode: 200,
      };

      const customPostSpy = vi
        .spyOn(service as any, "customPost")
        .mockResolvedValue(mockResponse);

      await service.executeEmailAction(mockParams as any);

      const serviceEndpoints = (service as any).endpoints;
      // The service maps EmailEndpoints.store → endpoints.create
      expect(customPostSpy).toHaveBeenCalledWith(
        serviceEndpoints.create,
        mockParams,
      );

      customPostSpy.mockRestore();
    });
  });

  describe("API endpoint integration", () => {
    it("should use EmailEndpoints for index and create (store) configuration", () => {
      const serviceEndpoints = (service as any).endpoints;

      expect(serviceEndpoints.index).toBe(endpoints.index);
      // The service maps EmailEndpoints.store → endpoints.create
      expect(serviceEndpoints.create).toBe(endpoints.store);
    });

    it("should have all endpoints matching EmailEndpoints", () => {
      const serviceEndpoints = (service as any).endpoints;

      expect(serviceEndpoints.show).toBe(endpoints.show);
      expect(serviceEndpoints.update).toBe(endpoints.update);
      expect(serviceEndpoints.delete).toBe(endpoints.delete);
    });
  });

  describe("error handling and edge cases", () => {
    describe("network errors", () => {
      it("should propagate network errors", async () => {
        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockRejectedValue(new Error("Network error"));

        await expect(service.executeEmailAction({} as any)).rejects.toThrow(
          "Network error",
        );

        customPostSpy.mockRestore();
      });

      it("should handle timeout errors", async () => {
        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockRejectedValue(new Error("Request timeout"));

        await expect(service.executeEmailAction({} as any)).rejects.toThrow(
          "Request timeout",
        );

        customPostSpy.mockRestore();
      });

      it("should handle connection refused", async () => {
        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockRejectedValue(new Error("Connection refused"));

        await expect(service.executeEmailAction({} as any)).rejects.toThrow(
          "Connection refused",
        );

        customPostSpy.mockRestore();
      });
    });

    describe("malformed responses", () => {
      it("should handle response with missing data field", async () => {
        const malformedResponse = {
          statusCode: 200,
          // missing data field
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValue(malformedResponse);

        const result = await service.executeEmailAction({} as any);

        expect(result).toBeDefined();
        customPostSpy.mockRestore();
      });

      it("should handle response with null data", async () => {
        const nullResponse = {
          data: null,
          statusCode: 200,
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValue(nullResponse);

        const result = await service.executeEmailAction({} as any);

        expect(result).toBeDefined();
        customPostSpy.mockRestore();
      });
    });

    describe("HTTP status codes", () => {
      it("should handle 400 bad request", async () => {
        const badRequest = {
          data: { status: false, message: "Bad request" },
          statusCode: 400,
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValue(badRequest);

        const result = await service.executeEmailAction({} as any);

        expect(result.statusCode).toBe(400);
        customPostSpy.mockRestore();
      });

      it("should handle 404 not found", async () => {
        const notFound = {
          data: { status: false, message: "Not found" },
          statusCode: 404,
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValue(notFound);

        const result = await service.executeEmailAction({} as any);

        expect(result.statusCode).toBe(404);
        customPostSpy.mockRestore();
      });

      it("should handle 500 internal server error", async () => {
        const serverError = {
          data: { status: false, message: "Internal server error" },
          statusCode: 500,
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValue(serverError);

        const result = await service.executeEmailAction({} as any);

        expect(result.statusCode).toBe(500);
        customPostSpy.mockRestore();
      });
    });

    describe("endpoint edge cases", () => {
      it("should have all endpoints as plain strings", () => {
        const serviceEndpoints = (service as any).endpoints;

        expect(typeof serviceEndpoints.show).toBe("string");
        expect(typeof serviceEndpoints.update).toBe("string");
        expect(typeof serviceEndpoints.delete).toBe("string");
      });
    });

    describe("concurrent requests", () => {
      it("should handle multiple executeEmailAction calls", async () => {
        const response1 = {
          data: { data: { id: 1, email: "test1@example.com" }, status: true },
          statusCode: 200,
        };
        const response2 = {
          data: { data: { id: 2, email: "test2@example.com" }, status: true },
          statusCode: 200,
        };

        const customPostSpy = vi
          .spyOn(service as any, "customPost")
          .mockResolvedValueOnce(response1)
          .mockResolvedValueOnce(response2);

        const [result1, result2] = await Promise.all([
          service.executeEmailAction({ email: "test1@example.com" } as any),
          service.executeEmailAction({ email: "test2@example.com" } as any),
        ]);

        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(customPostSpy).toHaveBeenCalledTimes(2);

        customPostSpy.mockRestore();
      });
    });
  });
});
