export interface MyGroup {
  id: string;
  name: string;
  myOwnershipPct: number;
  memberCount: number;
  description: string;
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  monthlyCost: number;
  vehicleType: string;
}

export interface GroupToJoin {
  id: string;
  vehicleName: string;
  vehicleModel: string;
  currentMembers: number;
  maxMembers: number;
  ownershipAvailable: number;
  region: string;
  purpose: string;
  createdDate: string;
  adminName: string;
  status: "open" | "full";
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  images?: string[];
  specs?: {
    rangeKm?: number;
    batteryKWh?: number;
    chargeType?: string;
    seats?: number;
    drivetrain?: string;
    color?: string;
    warrantyYears?: number;
  };
}

export const MY_GROUPS: MyGroup[] = [
  { 
    id: "grp-01", 
    name: "EV Shared Hanoi", 
    myOwnershipPct: 25, 
    memberCount: 4, 
    description: "Nhóm chia sẻ VF8 cho nhu cầu đi lại hằng ngày.",
    icon: "🚗",
    color: "blue",
    rating: 4.8,
    reviewCount: 24,
    monthlyCost: 450000,
    vehicleType: "VinFast VF8"
  },
  { 
    id: "grp-02", 
    name: "Model 3 Weekend", 
    myOwnershipPct: 10, 
    memberCount: 8, 
    description: "Cộng đồng sử dụng Tesla Model 3 cho cuối tuần.",
    icon: "⚡",
    color: "green",
    rating: 4.9,
    reviewCount: 36,
    monthlyCost: 400000,
    vehicleType: "Tesla Model 3"
  },
];

export const GROUPS_TO_JOIN: GroupToJoin[] = [
  {
    id: "grp-join-01",
    vehicleName: "Tesla Model 3",
    vehicleModel: "Standard Range Plus",
    currentMembers: 3,
    maxMembers: 5,
    ownershipAvailable: 40,
    region: "Hà Nội",
    purpose: "Đi lại hàng ngày",
    createdDate: "15/01/2025",
    adminName: "Nguyễn Văn A",
    status: "open",
    icon: "⚡",
    color: "blue",
    rating: 4.8,
    reviewCount: 32,
    priceRange: "2-3M VND",
    images: [
      "/demo/vehicles/model3-1.jpg",
      "/demo/vehicles/model3-2.jpg",
      "/demo/vehicles/model3-3.jpg"
    ],
    specs: {
      rangeKm: 448,
      batteryKWh: 57,
      chargeType: "Type2 • CCS2",
      seats: 5,
      drivetrain: "RWD",
      color: "Trắng",
      warrantyYears: 8
    }
  },
  {
    id: "grp-join-02", 
    vehicleName: "VinFast VF8",
    vehicleModel: "Eco",
    currentMembers: 2,
    maxMembers: 4,
    ownershipAvailable: 50,
    region: "TP.HCM",
    purpose: "Du lịch cuối tuần",
    createdDate: "20/01/2025",
    adminName: "Trần Thị B",
    status: "open",
    icon: "🚗",
    color: "green",
    rating: 4.6,
    reviewCount: 28,
    priceRange: "1.5-2.5M VND",
    images: [
      "/demo/vehicles/vf8-1.jpg",
      "/demo/vehicles/vf8-2.jpg",
      "/demo/vehicles/vf8-3.jpg"
    ],
    specs: {
      rangeKm: 420,
      batteryKWh: 82,
      chargeType: "Type2 • CCS2",
      seats: 5,
      drivetrain: "AWD",
      color: "Xanh",
      warrantyYears: 10
    }
  },
  {
    id: "grp-join-03",
    vehicleName: "BYD Atto 3",
    vehicleModel: "Comfort",
    currentMembers: 4,
    maxMembers: 4,
    ownershipAvailable: 0,
    region: "Đà Nẵng", 
    purpose: "Công việc",
    createdDate: "10/01/2025",
    adminName: "Lê Văn C",
    status: "full",
    icon: "🔋",
    color: "orange",
    rating: 4.7,
    reviewCount: 19,
    priceRange: "1-2M VND",
    images: [
      "/demo/vehicles/atto3-1.jpg",
      "/demo/vehicles/atto3-2.jpg"
    ],
    specs: {
      rangeKm: 420,
      batteryKWh: 60,
      chargeType: "Type2 • CCS2",
      seats: 5,
      drivetrain: "FWD",
      color: "Bạc",
      warrantyYears: 6
    }
  },
  {
    id: "grp-join-04",
    vehicleName: "Tesla Model Y",
    vehicleModel: "Long Range",
    currentMembers: 1,
    maxMembers: 6,
    ownershipAvailable: 83,
    region: "Hà Nội",
    purpose: "Gia đình",
    createdDate: "25/01/2025", 
    adminName: "Phạm Thị D",
    status: "open",
    icon: "⚡",
    color: "purple",
    rating: 4.9,
    reviewCount: 41,
    priceRange: "3-4M VND",
    images: [
      "/demo/vehicles/modely-1.jpg",
      "/demo/vehicles/modely-2.jpg",
      "/demo/vehicles/modely-3.jpg",
      "/demo/vehicles/modely-4.jpg"
    ],
    specs: {
      rangeKm: 533,
      batteryKWh: 75,
      chargeType: "Type2 • CCS2",
      seats: 5,
      drivetrain: "AWD",
      color: "Trắng",
      warrantyYears: 8
    }
  }
];


