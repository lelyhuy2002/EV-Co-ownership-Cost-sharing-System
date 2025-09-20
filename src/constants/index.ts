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
    title: "Khám phá và Lựa chọn",
    description: "Tìm kiếm dữ liệu bạn cần với bộ lọc thông minh, từ hành trình lái xe đến hiệu suất pin, và khám phá các gói dữ liệu được tối ưu cho từng lĩnh vực.",
    icon: "/search-icon.svg"
  },
  {
    number: "2",
    title: "Thực hiện giao dịch an toàn",
    description: "Thanh toán linh hoạt theo lượt tải hoặc gói thuê bao, sau đó tích hợp dữ liệu vào hệ thống của bạn chỉ với vài cú click thông qua API.",
    icon: "/api-icon.svg"
  },
  {
    number: "3",
    title: "Khai thác sức mạnh của dữ liệu",
    description: "Sử dụng dashboard trực quan để phân tích chuyên sâu và áp dụng công cụ AI để dự đoán xu hướng, đưa ra quyết định kinh doanh đột phá.",
    icon: "/analytics-icon.svg"
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
  },
  {
    question: "Dữ liệu trên sàn giao dịch có được cập nhật thường xuyên không?",
    answer: "Có. Dữ liệu trên nền tảng được cập nhật liên tục, đảm bảo người dùng luôn có quyền truy cập vào các tập dữ liệu mới nhất và theo thời gian thực. Các nhà cung cấp sẽ tự động đồng bộ dữ liệu mới ngay khi có."
  },
  {
    question: "Làm thế nào để tôi có thể trở thành Nhà cung cấp dữ liệu?",
    answer: "Rất đơn giản. Bạn chỉ cần đăng ký tài khoản Nhà cung cấp dữ liệu, tải lên và mô tả chi tiết tập dữ liệu của mình. Hệ thống của chúng tôi sẽ xem xét và phê duyệt để đảm bảo chất lượng, sau đó dữ liệu của bạn sẽ sẵn sàng để giao dịch trên marketplace."
  },
  {
    question: "Tôi có cần kiến thức chuyên sâu về phân tích dữ liệu để sử dụng dashboard không?",
    answer: "Không cần. Dashboard của chúng tôi được thiết kế trực quan và dễ sử dụng cho mọi đối tượng. Bạn chỉ cần chọn gói dữ liệu, hệ thống sẽ tự động hiển thị các biểu đồ và báo cáo chi tiết, giúp bạn dễ dàng khai thác thông tin mà không cần kiến thức chuyên sâu."
  },
  {
    question: "Sàn giao dịch này có phù hợp với các cá nhân và sinh viên không?",
    answer: "Có. Nền tảng của chúng tôi có các gói dữ liệu linh hoạt, bao gồm cả gói miễn phí hoặc gói theo lượt tải rất nhỏ, phù hợp cho mục đích nghiên cứu, học thuật hoặc các dự án cá nhân."
  }
];

export const PARTNERS: Partner[] = [
  { src: "/tesla-logo.svg", alt: "Tesla", width: 160, height: 32 },
  { src: "/byd-logo.svg", alt: "BYD", width: 120, height: 36 },
  { src: "/vinfast-logo.svg", alt: "VinFast", width: 140, height: 32 },
  { src: "/aws-logo.svg", alt: "Amazon Web Services", width: 120, height: 36 },
  { src: "/microsoft-logo.svg", alt: "Microsoft", width: 140, height: 32 },
  { src: "/google-logo.svg", alt: "Google Cloud", width: 120, height: 36 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "Nền tảng này đã giúp chúng tôi tối ưu hệ thống sạc công cộng, giảm 20% chi phí vận hành và tăng hiệu suất sử dụng lên 35%. Dữ liệu thời gian thực cho phép chúng tôi đưa ra quyết định nhanh chóng và chính xác.",
    avatar: "/avatar-1.svg",
    name: "Nguyễn Minh Tuấn",
    position: "Giám đốc Công nghệ",
    company: "EVTech Solutions",
    companyLogo: "/company-logo-1.svg"
  },
  {
    text: "Dữ liệu phong phú và API dễ tích hợp. Triển khai pilot chỉ trong một tuần. Dashboard trực quan giúp đội ngũ của chúng tôi hiểu rõ hành vi người dùng và tối ưu hóa dịch vụ.",
    avatar: "/avatar-2.svg",
    name: "Trần Thị Lan Anh",
    position: "Trưởng phòng Vận hành",
    company: "Green Mobility",
    companyLogo: "/company-logo-2.svg"
  },
  {
    text: "Bảng điều khiển trực quan, giúp đội vận hành theo dõi hiệu suất theo thời gian thực. Công cụ AI dự đoán xu hướng đã giúp chúng tôi tiết kiệm 30% thời gian phân tích và tăng độ chính xác lên 95%.",
    avatar: "/avatar-3.svg",
    name: "Lê Văn Hùng",
    position: "Giám đốc Phân tích Dữ liệu",
    company: "DataFlow Inc",
    companyLogo: "/company-logo-3.svg"
  },
  {
    text: "Hệ thống quản lý lưới điện thông minh của chúng tôi đã được cải thiện đáng kể nhờ dữ liệu EV. Khả năng dự đoán nhu cầu điện và tối ưu phân phối đã giúp giảm 25% tổn thất điện năng và tăng độ ổn định lưới điện.",
    avatar: "/avatar-4.svg",
    name: "Phạm Đức Thành",
    position: "Giám đốc Kỹ thuật",
    company: "PowerGrid",
    companyLogo: "/company-logo-4.svg"
  },
  {
    text: "Tích hợp dữ liệu EV vào hệ thống quản lý trạm sạc đã mang lại hiệu quả bất ngờ. Chúng tôi có thể dự đoán thời điểm cao điểm, tối ưu hóa vị trí trạm sạc mới và giảm 40% thời gian chờ đợi của khách hàng.",
    avatar: "/avatar-5.svg",
    name: "Hoàng Thị Mai",
    position: "Trưởng phòng Phát triển Sản phẩm",
    company: "SmartCharge",
    companyLogo: "/company-logo-5.svg"
  },
  {
    text: "Dữ liệu hành trình và hiệu suất pin từ nền tảng này đã giúp chúng tôi phát triển ứng dụng định tuyến thông minh. Người dùng có thể tối ưu hóa lộ trình, tiết kiệm năng lượng và giảm 15% thời gian di chuyển.",
    avatar: "/avatar-6.svg",
    name: "Vũ Minh Đức",
    position: "Giám đốc Sản phẩm",
    company: "EcoDrive",
    companyLogo: "/company-logo-6.svg"
  },
  {
    text: "Nghiên cứu và phát triển xe điện của chúng tôi đã được tăng tốc nhờ dữ liệu thực tế từ nền tảng. Hiểu rõ hành vi người dùng và mô hình sử dụng đã giúp chúng tôi thiết kế pin hiệu quả hơn và tăng phạm vi hoạt động lên 20%.",
    avatar: "/avatar-7.svg",
    name: "Đặng Thị Hương",
    position: "Trưởng phòng R&D",
    company: "FutureEV",
    companyLogo: "/company-logo-7.svg"
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "#home", label: "Trang chủ", emoji: "🏠", id: "home" },
  { href: "/find-groups", label: "Tìm & Tham gia nhóm", emoji: "🔍", id: "find-groups" },
  { href: "/groups", label: "Quản lý nhóm", emoji: "📊", id: "dashboard" },
  { href: "/dashboard", label: "Dashboard", emoji: "📊", id: "provider" },
  { href: "#about", label: "Giới thiệu", emoji: "ℹ️", id: "about" },
  { href: "#contact", label: "Liên hệ", emoji: "📞", id: "contact" }
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
