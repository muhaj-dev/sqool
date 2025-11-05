import { useQuery } from "@tanstack/react-query";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { Student,StatusFilter } from "@/types";

// Mock data for demonstration
const mockStudents: Record<string, (Student & {status:StatusFilter})[]> = {
  "p3-math": [
    { id: "1", name: "Adewale Johnson", rollNumber: "P3/001", class: "Primary 3A", gender: "Male", age: 8, guardianName: "Mr. Johnson", attendanceRate: 95, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adewale",status:"absent" },
    { id: "2", name: "Fatima Ibrahim", rollNumber: "P3/002", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Ibrahim", attendanceRate: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",status:"absent" },
    { id: "3", name: "Chidi Okonkwo", rollNumber: "P3/003", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Okonkwo", attendanceRate: 88, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi" ,status:"absent"},
    { id: "4", name: "Aisha Mohammed", rollNumber: "P3/004", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Mohammed", attendanceRate: 97, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",status:"absent" },
    { id: "5", name: "Tunde Adeleke", rollNumber: "P3/005", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Adeleke", attendanceRate: 90, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde",status:"absent" },
    { id: "6", name: "Chiamaka Nwosu", rollNumber: "P3/006", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Nwosu", attendanceRate: 94, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chiamaka",status:"absent" },
    { id: "7", name: "Usman Bello", rollNumber: "P3/007", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Bello", attendanceRate: 85, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman" ,status:"absent"},
    { id: "8", name: "Ngozi Eze", rollNumber: "P3/008", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Eze", attendanceRate: 96, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi",status:"absent" },
    { id: "21", name: "Biodun Afolabi", rollNumber: "P3/009", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Afolabi", attendanceRate: 91, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Biodun",status:"absent" },
    { id: "22", name: "Halima Yusuf", rollNumber: "P3/010", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Yusuf", attendanceRate: 93, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Halima",status:"absent" },
    { id: "23", name: "Chinonso Okafor", rollNumber: "P3/011", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Okafor", attendanceRate: 87, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chinonso",status:"absent" },
    { id: "24", name: "Rukayat Balogun", rollNumber: "P3/012", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Balogun", attendanceRate: 95, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rukayat",status:"absent" },
    { id: "25", name: "Emmanuel Adebayo", rollNumber: "P3/013", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Adebayo", attendanceRate: 89, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel" ,status:"absent"},
    { id: "26", name: "Zainab Hassan", rollNumber: "P3/014", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Hassan", attendanceRate: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab",status:"absent" },
    { id: "27", name: "Segun Oladele", rollNumber: "P3/015", class: "Primary 3A", gender: "Male", age: 9, guardianName: "Mr. Oladele", attendanceRate: 90, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Segun",status:"absent" },
    { id: "28", name: "Aminat Sanni", rollNumber: "P3/016", class: "Primary 3A", gender: "Female", age: 8, guardianName: "Mrs. Sanni", attendanceRate: 94, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminat",status:"absent" },
  ],
  "p3-science": [
    { id: "9", name: "Emeka Okeke", rollNumber: "P3/009", class: "Primary 3B", gender: "Male", age: 9, guardianName: "Mr. Okeke", attendanceRate: 93, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka",status:"absent" },
    { id: "10", name: "Hauwa Yusuf", rollNumber: "P3/010", class: "Primary 3B", gender: "Female", age: 8, guardianName: "Mrs. Yusuf", attendanceRate: 91, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hauwa",status:"absent" },
    { id: "11", name: "Oluwaseun Balogun", rollNumber: "P3/011", class: "Primary 3B", gender: "Male", age: 9, guardianName: "Mr. Balogun", attendanceRate: 88, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oluwaseun",status:"absent" },
    { id: "12", name: "Zainab Abubakar", rollNumber: "P3/012", class: "Primary 3B", gender: "Female", age: 8, guardianName: "Mrs. Abubakar", attendanceRate: 96, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainabA" ,status:"absent"},
  ],
  "p4-math": [
    { id: "13", name: "Ibrahim Sani", rollNumber: "P4/001", class: "Primary 4A", gender: "Male", age: 10, guardianName: "Mr. Sani", attendanceRate: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim",status:"absent" },
    { id: "14", name: "Blessing Okafor", rollNumber: "P4/002", class: "Primary 4A", gender: "Female", age: 9, guardianName: "Mrs. Okafor", attendanceRate: 95, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blessing",status:"absent" },
    { id: "15", name: "Ahmed Hassan", rollNumber: "P4/003", class: "Primary 4A", gender: "Male", age: 10, guardianName: "Mr. Hassan", attendanceRate: 89, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",status:"absent" },
    { id: "16", name: "Chioma Udeh", rollNumber: "P4/004", class: "Primary 4A", gender: "Female", age: 9, guardianName: "Mrs. Udeh", attendanceRate: 94, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",status:"absent" },
  ],
  "p5-science": [
    { id: "17", name: "Yusuf Danjuma", rollNumber: "P5/001", class: "Primary 5A", gender: "Male", age: 11, guardianName: "Mr. Danjuma", attendanceRate: 91, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf",status:"absent" },
    { id: "18", name: "Amina Suleiman", rollNumber: "P5/002", class: "Primary 5A", gender: "Female", age: 10, guardianName: "Mrs. Suleiman", attendanceRate: 97, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",status:"absent" },
    { id: "19", name: "Oluwatobi Adeyemi", rollNumber: "P5/003", class: "Primary 5A", gender: "Male", age: 11, guardianName: "Mr. Adeyemi", attendanceRate: 88, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oluwatobi",status:"absent" },
    { id: "20", name: "Khadija Musa", rollNumber: "P5/004", class: "Primary 5A", gender: "Female", age: 10, guardianName: "Mrs. Musa", attendanceRate: 95, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khadija",status:"absent" },
  ],
};

export function useAttendanceData() {
  const { selectedClass } = useAttendanceStore();

  return useQuery({
    queryKey: ["attendance", selectedClass],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockStudents[selectedClass] || [];
    },
    enabled: !!selectedClass,
  });
}
