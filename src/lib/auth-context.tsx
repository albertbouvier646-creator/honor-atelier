import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferredLanguage: string;
  measurements?: {
    stature?: string;
    poitrine?: string;
    taille?: string;
    hanches?: string;
    carrureDos?: string;
  };
}

export interface EnrolledCourse {
  slug: string;
  titre: string;
  image: string;
  progressPercent: number;
  enrolledDate: string;
}

export interface OrderItem {
  id: string;
  date: string;
  itemNom: string;
  fabricNom: string;
  totalEur: number;
  status: "En attente d'atelier" | "En confection" | "Prêt pour expédition" | "Livré";
}

interface AuthContextType {
  user: UserProfile | null;
  enrolledCourses: EnrolledCourse[];
  orders: OrderItem[];
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateMeasurements: (m: UserProfile["measurements"]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: UserProfile = {
  name: "Éléonore de Saint-Germain",
  email: "eleonore@example.com",
  phone: "+33 6 12 34 56 78",
  address: "14 Rue du Faubourg Saint-Honoré, 75008 Paris",
  preferredLanguage: "fr",
  measurements: {
    stature: "172",
    poitrine: "88",
    taille: "66",
    hanches: "92",
    carrureDos: "38",
  },
};

const DEMO_COURSES: EnrolledCourse[] = [
  {
    slug: "nappe-festonnee",
    titre: "Maîtrise de la Nappe Festonnée",
    image: "/src/assets/cours-nappe.jpg",
    progressPercent: 65,
    enrolledDate: "12/07/2026",
  },
  {
    slug: "chemisier-signature",
    titre: "Confection du Chemisier Signature",
    image: "/src/assets/cours-chemisier.jpg",
    progressPercent: 20,
    enrolledDate: "28/07/2026",
  },
];

const DEMO_ORDERS: OrderItem[] = [
  {
    id: "HNR-2026-8941",
    date: "01/08/2026",
    itemNom: "Nappe d'Atelier",
    fabricNom: "Lin belge lavé",
    totalEur: 380,
    status: "En confection",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrolledCourses] = useState<EnrolledCourse[]>(DEMO_COURSES);
  const [orders] = useState<OrderItem[]>(DEMO_ORDERS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("honor_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignorer
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      ...DEMO_USER,
      email,
      name: name || DEMO_USER.name,
    };
    setUser(newUser);
    localStorage.setItem("honor_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("honor_user");
  };

  const updateMeasurements = (m: UserProfile["measurements"]) => {
    if (!user) return;
    const updated = { ...user, measurements: m };
    setUser(updated);
    localStorage.setItem("honor_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, enrolledCourses, orders, login, logout, updateMeasurements }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
