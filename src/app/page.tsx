"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  School,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function Home() {
  // const navigation = useRouter()
  // useEffect(() => {
  //   // navigation.push("/signin")
  // }, [navigation])

  const keyFeatures = [
    {
      title: "Online / Blended Classroom Solution",
      description:
        "Virtual and hybrid learning platform with real-time collaboration tools.",
      icon: "💻",
    },
    {
      title: "Standard School Website",
      description:
        "Professional website with your own domain name integrated seamlessly.",
      icon: "🌐",
    },
    {
      title: "Full-featured Operations Portal",
      description:
        "Complete management system for all school operations and workflows.",
      icon: "⚙️",
    },
  ];

  const benefits = {
    administrators: [
      "Online presence and seamless marketing - increased publicity and wider reach",
      "Better, easier and more efficient management of data, people and processes",
      "Convenient and timely access to all data records and reports",
      "Better insights. Data-driven decisions",
      "Reduced workload. Increased job convenience",
      "Reduced overhead cost. Improved accountability",
      "Increased overall productivity and standard",
      "More involved and satisfied parents",
    ],
    teachers: [
      "Become the 21st century, tech-age educator you should be",
      "Stay organized, achieve more with less workload",
      "Results computation in clicks - no longer days and nights pressing calculators",
      "Generate annual results in just a push of buttons",
      "Better and easier class management - data, records, assessments, grading, reporting",
      "Work and communicate better and timely with students' parents/guardians",
      "Increased productivity, job convenience and motivation",
    ],
    parents: [
      "Get involved right from the office, home or anywhere",
      "Make fees payments by yourself conveniently from anywhere",
      "Easier and first-hand access to children's fees info, results and performance reports",
      "Access to attendance reports, timetables and schedule of activities",
      "View assignments/homework, lesson notes and learning resources",
      "Direct, timely access to crucial info and announcements",
    ],
    students: [
      "Better and digitized learning approach",
      "All-time access to learning resources - learn at your own pace",
      "Stay connected and collaborate better with co-learners",
      "Focus on learning while your guardians/parents stay informed",
    ],
  };

  const whyChoose = [
    {
      title: "All-in-one",
      description: "Everything you need in one comprehensive platform",
      icon: "📦",
    },
    {
      title: "Active Support",
      description: "We're always here to help you succeed",
      icon: "🎧",
    },
    {
      title: "Cost Effective",
      description: "Affordable pricing with maximum value",
      icon: "💰",
    },
    {
      title: "User Friendly",
      description: "Intuitive interface requiring minimal training",
      icon: "😊",
    },
    {
      title: "Regular Updates",
      description: "Continuous improvements at no extra cost",
      icon: "🔄",
    },
    {
      title: "On-site Training",
      description: "Comprehensive training for your staff",
      icon: "🎓",
    },
  ];

  const featureModules = [
    [
      "Standard School Website",
      "Administrator Tools",
      "Students E-Portal",
      "Staff/Employees E-Portal",
    ],
    [
      "Parents E-Portal",
      "Online Admission Management",
      "User Information Systems",
      "Fees/Bursary Management",
    ],
    [
      "Online Fees Payment & Tracking",
      "Financial Bookkeeping & Reports",
      "HR/Payroll Management",
      "Hostel Management",
    ],
    [
      "Computer-Based Testing (CBT/CBE)",
      "Result Processing & Publishing",
      "Result Checker",
      "School Library Management",
    ],
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* <div className="h-[100px] flex flex-col items-center ">
      <p className="text-primaryColor text-5xl">Coming Soon...</p>
      <Link href={'/signin'}
      className="bg-primaryColor text-white px-12 mt-24 py-5 rounded-lg"
      >
      Sign in to to have access
      </Link>

    </div> */}
      <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SQOOLIFY</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <a
                href="#home"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Benefits
              </a>
              <a
                href="#why-choose"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Why Choose Us
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link href={"/signin"}>
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <Badge
                variant="secondary"
                className="px-6 py-2 text-sm font-medium backdrop-blur-sm"
              >
                <Star className="h-4 w-4 mr-2 inline fill-yellow-500 text-yellow-500" />
                Trusted by 500+ Schools Worldwide
              </Badge>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
                  Transform Your School Management
                </span>
                <br />
                <span className="text-primary">Experience</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The all-in-one platform that empowers administrators, teachers,
                parents, and students to collaborate seamlessly. Build your
                reputable school brand and boost productivity.
              </p>

              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
                <CheckCircle className="h-6 w-6" />
                <span>Go Digital in less than 10 minutes</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button type="button" className="text-lg px-8 group">
                  <a href="#contact">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-lg px-8"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
                <Link href={"/signin"}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-lg px-8"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold"
                      >
                        {i === 1
                          ? "😊"
                          : i === 2
                          ? "🎓"
                          : i === 3
                          ? "👨‍🏫"
                          : "👪"}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                    <span className="text-sm font-semibold ml-2">5.0</span>
                    <span className="text-sm text-muted-foreground">
                      (500+ reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free 30-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Use your own Domain</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t">
              {[
                { value: "500+", label: "Schools", icon: School },
                { value: "50K+", label: "Active Users", icon: Users },
                { value: "99.9%", label: "Uptime", icon: TrendingUp },
                { value: "24/7", label: "Support", icon: Shield },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center space-y-3 group hover:scale-105 transition-transform"
                >
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Key Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Digital Solution</h2>
            <p className="text-xl text-muted-foreground">Everything your school needs to thrive in the digital age</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-4xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>


  {/* Testimonial Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-primary-foreground/10 border-primary-foreground/20">
            <div className="p-12 text-center">
              <div className="text-5xl mb-6">"</div>
              <p className="text-xl italic mb-6 leading-relaxed">
                The daily tasks of being the school bursar have never been this easy to accomplish. 
                Thanks to our management for adopting this new system. The system has made my work so much easier and more efficient.
              </p>
              <div className="space-y-1">
                <p className="font-bold text-lg">ANI FRANCISCA</p>
                <p className="text-primary-foreground/80">Bursar, God Provides Group of Schools, Enugu</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
        {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Benefits for Everyone</h2>
            <p className="text-xl text-muted-foreground">Designed to serve every member of your school community</p>
          </div>
          
          <div className="space-y-12">
            {/* Schools & Administrators */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Schools and Administrators</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.administrators.map((benefit, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1 text-lg font-bold">✓</div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Teachers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Teachers</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.teachers.map((benefit, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1 text-lg font-bold">✓</div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Parents */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Parents</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.parents.map((benefit, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1 text-lg font-bold">✓</div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Students */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Students</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.students.map((benefit, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1 text-lg font-bold">✓</div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Sqoolify?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Honestly, why not? Sqoolify offers you A-List sought after tools and features in a School Management Software; 
              with more being developed and added frequently. We won&apos;t stop at anything to provide your school with the right tools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Modules Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Features</h2>
            <p className="text-xl text-muted-foreground">All the tools you need in one powerful platform</p>
          </div>
          <div className="space-y-4">
            {featureModules.map((row, rowIndex) => (
              <div key={rowIndex} className="grid md:grid-cols-4 gap-4">
                {row.map((module, colIndex) => (
                  <Card key={colIndex} className="p-4 text-center hover:shadow-lg transition-all hover:scale-105 duration-200 cursor-pointer">
                    <p className="font-semibold text-sm">{module}</p>
                  </Card>
                ))}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button  type="button"  variant="outline" className="text-lg px-8">
              See All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">Hosted and Maintained for You</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We take care of all the big technicalities, so you don&apos;t have to. While you focus on what matters most, 
              we work round the clock to ensure you have the right digital tools in place to manage and grow your school.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold mb-4">Use Your Own Domain Name</h3>
                <p className="text-muted-foreground">
                  We understand that you want a unique brand identity for your school. Sqoolify enables your school 
                  to maintain its own website address. Simply connect a domain name you already own or get one for your school.
                </p>
              </Card>
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold mb-4">Integrate with Existing Website</h3>
                <p className="text-muted-foreground">
                  Already have a school website? No problem! Sqoolify can easily be integrated with your existing 
                  school website or domain. Set the service you need and connect your domain - Done!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your school
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {["Basic", "Professional", "Enterprise"].map((plan, index) => (
              <Card key={index} className={index === 1 ? "border-primary shadow-lg scale-105" : ""}>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan}</h3>
                    <div className="text-4xl font-bold text-primary">
                      ₦{index === 0 ? "50,000" : index === 1 ? "100,000" : "Custom"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">per term</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>Up to {index === 0 ? "100" : index === 1 ? "500" : "Unlimited"} students</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>{index === 2 ? "24/7" : "Business hours"} support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>{index === 0 ? "1000" : index === 1 ? "5000" : "Unlimited"} SMS credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>All core features</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant={index === 1 ? "default" : "outline"}  type="button">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Let&apos;s Take Your School Online</h2>
              <p className="text-xl text-muted-foreground">
                Join the league of ambitious schools leveraging technology to achieve academic excellence
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Phone Number" />
                  <Input placeholder="School Name" />
                  <textarea
                    className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[120px] resize-none"
                    placeholder="Your Message"
                  />
                  <Button className="w-full"  type="button">
                    Get Started Today
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Phone className="h-6 w-6 text-primary mx-auto" />
                <div className="text-sm font-medium">Phone</div>
                <div className="text-sm text-muted-foreground">+234 811 7321 421</div>
              </div>
              <div className="space-y-2">
                <Mail className="h-6 w-6 text-primary mx-auto" />
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">info@sqoolify.com</div>
              </div>
              <div className="space-y-2">
                <MapPin className="h-6 w-6 text-primary mx-auto" />
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <School className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">SQOOLIFY</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Make your school world-class with the right digital technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#home" className="block hover:text-primary transition-colors">Home</a>
                <a href="#features" className="block hover:text-primary transition-colors">Features</a>
                <a href="#benefits" className="block hover:text-primary transition-colors">Benefits</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#contact" className="block hover:text-primary transition-colors">Contact</a>
                <a href="#" className="block hover:text-primary transition-colors">Help Center</a>
                <a href="#" className="block hover:text-primary transition-colors">Live Chat</a>
                <a href="#" className="block hover:text-primary transition-colors">Affiliate</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Sqoolify. All rights reserved.</p>
          </div>
        </div>
      </footer>
 




    </div>
  );
}
