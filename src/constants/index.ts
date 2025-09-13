import { Benefit, Step, FAQ, Partner, Testimonial, NavigationItem, SocialLink } from '@/types';

export const BENEFITS: Benefit[] = [
  {
    icon: "📚",
    title: "Dữ liệu phong phú, đáng tin cậy",
    description: "Truy cập kho dữ liệu khổng lồ, được thu thập trực tiếp từ các hãng xe và trạm sạc uy tín. Dữ liệu sạch, được chuẩn hóa, và cập nhật theo thời gian thực."
  },
  {
    icon: "📊",
    title: "Dashboard trực quan, tùy chỉnh",
    description: "Trực quan hóa dữ liệu với dashboard thông minh. Tạo báo cáo, phân tích hiệu suất pin (SoC/SOH), dự đoán hành vi người dùng và tùy chỉnh biểu đồ theo nhu cầu riêng của bạn."
  },
  {
    icon: "🔒",
    title: "An toàn & Riêng tư tuyệt đối",
    description: "Mọi dữ liệu cá nhân đều được ẩn danh hóa theo tiêu chuẩn GDPR/CCPA trước khi giao dịch. Hệ thống của chúng tôi đảm bảo tính toàn vẹn và bảo mật cao nhất, bảo vệ tài sản dữ liệu của bạn."
  },
  {
    icon: "🔗",
    title: "Tích hợp API liền mạch",
    description: "Dễ dàng kết nối với hệ thống của bạn qua API, cho phép bạn nhanh chóng đưa dữ liệu EV vào các ứng dụng quản lý đội xe, hệ thống bảo hiểm hoặc các công cụ phân tích khác."
  },
  {
    icon: "🎯",
    title: "Hỗ trợ chuyên nghiệp 24/7",
    description: "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi, đảm bảo bạn có thể khai thác tối đa giá trị từ dữ liệu."
  }
];

export const STEPS: Step[] = [
  {
    number: "1",
    title: "Tìm kiếm",
    description: "Tìm và chọn gói dữ liệu phù hợp nhu cầu."
  },
  {
    number: "2",
    title: "Mua và Tích hợp",
    description: "Thanh toán và tích hợp vào hệ thống qua API."
  },
  {
    number: "3",
    title: "Phân tích",
    description: "Dùng dashboard và AI để ra quyết định."
  }
];

export const FAQS: FAQ[] = [
  {
    question: "Tôi có thể thử dữ liệu trước khi mua không?",
    answer: "Có, chúng tôi cung cấp dataset mẫu và sandbox API để bạn đánh giá."
  },
  {
    question: "Thanh toán hỗ trợ phương thức nào?",
    answer: "Ví điện tử và thẻ quốc tế; hoá đơn điện tử được cấp sau khi hoàn tất."
  },
  {
    question: "Dữ liệu có được ẩn danh không?",
    answer: "Tất cả dữ liệu đều được ẩn danh theo chính sách bảo mật nghiêm ngặt."
  }
];

export const PARTNERS: Partner[] = [
  { src: "/vercel.svg", alt: "Partner", width: 96, height: 96 },
  { src: "/next.svg", alt: "Partner", width: 120, height: 24 },
  { src: "/globe.svg", alt: "Partner", width: 48, height: 48 },
  { src: "/file.svg", alt: "Partner", width: 48, height: 48 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "Nền tảng này đã giúp chúng tôi tối ưu hệ thống sạc công cộng, giảm 20% chi phí vận hành.",
    avatar: "/vercel.svg",
  },
  {
    text: "Dữ liệu phong phú và API dễ tích hợp. Triển khai pilot chỉ trong một tuần.",
    avatar: "/next.svg",
  },
  {
    text: "Bảng điều khiển trực quan, giúp đội vận hành theo dõi hiệu suất theo thời gian thực.",
    avatar: "/globe.svg",
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "#home", label: "Home", emoji: "🏠", id: "home" },
  { href: "#marketplace", label: "Marketplace", emoji: "🛒", id: "marketplace" },
  { href: "#benefits", label: "Why Us", emoji: "✨", id: "benefits" },
  { href: "#testimonials", label: "Reviews", emoji: "💬", id: "testimonials" }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "#", label: "LinkedIn", icon: "in" },
  { href: "#", label: "Twitter", icon: "X" }
];

export const COMPANY_INFO = {
  name: "EV Data Marketplace",
  description: "EV Data Marketplace — hạ tầng giao dịch dữ liệu cho ngành xe điện.",
  email: "contact@evdata.local",
  logo: "/ev-logo-custom.svg"
} as const;
