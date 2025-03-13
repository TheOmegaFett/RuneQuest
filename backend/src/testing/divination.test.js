const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const divinationRoutes = require("../routes/divinationRoutes");
const { generateTestToken } = require("./helpers/authHelper");

// Mock data
const mockRunes = [
  {
    _id: "rune1",
    name: "Fehu",
    meaning: "Wealth, cattle",
    history: "Represents mobile wealth and resources",
    relationships: [
      { rune: "rune2", nature: "complementary", description: "Resource flow" },
    ],
  },
  {
    _id: "rune2",
    name: "Uruz",
    meaning: "Strength, wild ox",
    history: "Represents primal strength and health",
    relationships: [
      { rune: "rune1", nature: "complementary", description: "Material power" },
    ],
  },
  {
    _id: "rune3",
    name: "Thurisaz",
    meaning: "Thor's hammer, giant",
    history: "Represents defensive power",
    relationships: [],
  },
  {
    _id: "rune4",
    name: "Ansuz",
    meaning: "God, mouth, communication",
    history: "Represents wisdom and communication",
    relationships: [],
  },
  {
    _id: "rune5",
    name: "Raidho",
    meaning: "Ride, journey",
    history: "Represents movement and right action",
    relationships: [],
  },
];

// Set up mocks
jest.mock("../middleware/checkAuthority", () => {
  return {
    checkAuthority: (req, res, next) => {
      // Extract the token from the Authorization header
      let token = req.get("authorization"); // Bearer the-actual-token
      token = token?.split(" ")?.[1]; // the-actual-token

      // Set userId from the token
      if (token) {
        const jwt = require("jsonwebtoken");
        try {
          const decoded = jwt.verify(token, "secret");
          req.userId = decoded.id;
        } catch (error) {
          // Token invalid
        }
      }
      next();
    },
  };
});

jest.mock("../models/Rune", () => {
  function MockRune(data) {
    if (data) Object.assign(this, data);
  }

  MockRune.aggregate = jest.fn().mockImplementation(([{ $sample }]) => {
    const size = $sample.size;
    // Ensure we return different runes for different requests
    // but with deterministic results for testing
    return Promise.resolve(mockRunes.slice(0, size));
  });

  return MockRune;
});

jest.mock("../models/Divination", () => {
  return {
    find: jest.fn().mockImplementation(() => {
      return {
        sort: jest.fn().mockResolvedValue([
          {
            _id: "mockReadingId123",
            userId: "testUser123",
            runes: [],
            date: new Date(),
          },
        ]),
      };
    }),
    create: jest.fn().mockImplementation((data) => {
      // Add the _id property to simulate MongoDB's behavior
      return Promise.resolve({
        ...data,
        _id: "mockReadingId" + Math.floor(Math.random() * 1000),
      });
    }),
  };
});

jest.mock("../models/User", () => {
  return {
    findById: jest.fn().mockImplementation((id) => {
      if (id === "admin123") {
        return Promise.resolve({
          _id: id,
          username: "admin",
          isAdmin: true,
        });
      } else {
        return Promise.resolve({
          _id: id,
          username: "regularUser",
          isAdmin: false,
        });
      }
    }),
  };
});
// Setup express app for testing
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    // Decode the token and set req.userId
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, "secret");
      req.userId = decoded.id;
    } catch (error) {
      // Token invalid - don't set userId
    }
  }
  next();
});

app.use("/api/divination", divinationRoutes);

const userId = "user123";
const token = generateTestToken(userId);

describe("Divination Controller Tests", () => {
  describe("GET /api/divination/single", () => {
    it("should return a single rune reading", async () => {
      const response = await request(app)
        .get("/api/divination/single")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.rune).toBeDefined();
      expect(response.body.interpretation).toBeDefined();
    });
  });

  describe("GET /api/divination/three", () => {
    it("should return a three rune spread", async () => {
      const response = await request(app)
        .get("/api/divination/three")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.runes).toHaveLength(3);
      expect(response.body.interpretation).toHaveLength(3);

      // Verify positions are properly assigned
      expect(response.body.interpretation[0].position).toBe(1);
      expect(response.body.interpretation[1].position).toBe(2);
      expect(response.body.interpretation[2].position).toBe(3);
    });
  });

  describe("GET /api/divination/five", () => {
    it("should return a five rune spread", async () => {
      const response = await request(app)
        .get("/api/divination/five")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.runes).toHaveLength(5);
      expect(response.body.interpretation).toHaveLength(5);
    });
  });

  describe("POST /api/divination/save", () => {
    it("should save a reading to user history", async () => {
      const readingData = {
        userId,
        runes: mockRunes.slice(0, 3).map((r) => r._id), // Make sure these are just IDs
        interpretation: "Past, present, future reading interpretation",
        spread: "three",
      };

      const response = await request(app)
        .post("/api/divination/save")
        .set("Authorization", `Bearer ${token}`)
        .send(readingData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
    });
  });

  describe("GET /api/divination/history/:userId", () => {
    it("should return user's reading history", async () => {
      const response = await request(app)
        .get(`/api/divination/history/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should prevent access to another user's history", async () => {
      const otherToken = generateTestToken("otherUser");

      const response = await request(app)
        .get(`/api/divination/history/${userId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });
    it("should allow admin users to access any user's history", async () => {
      const adminToken = generateTestToken("admin123");

      const response = await request(app)
        .get(`/api/divination/history/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe("interpretSpread function", () => {
    it("should correctly analyze relationships between runes", async () => {
      // This test would directly call the interpretSpread function
      // with controlled inputs to verify relationship detection
      const twoRunesWithRelationship = mockRunes.slice(0, 2);

      // We need to extract and test the interpretSpread function directly
      const {
        interpretSpread,
      } = require("../controllers/divinationController");
      const interpretation = interpretSpread(twoRunesWithRelationship);

      expect(interpretation[0].relationships).toHaveLength(1);
      expect(interpretation[0].relationships[0].rune).toBe("rune2");
    });
  });
});
