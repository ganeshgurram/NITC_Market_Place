import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CategoryFilterProps {
  selectedDepartment: string;
  selectedSemester: string;
  selectedType: string;
  selectedAvailability: string;
  onDepartmentChange: (department: string) => void;
  onSemesterChange: (semester: string) => void;
  onTypeChange: (type: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onClearFilters: () => void;
}

const departments = [
  "All Departments",
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering", 
  "Chemical Engineering",
  "Electrical Engineering",
  "Architecture",
  "Mathematics",
  "Physics",
  "Chemistry"
];

const semesters = [
  "All Semesters",
  "1st Semester",
  "2nd Semester", 
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const itemTypes = [
  "All Types",
  "For Sale",
  "For Rent",
  "Free/Donation"
];

const availabilityOptions = [
  "Available Only",
  "All Items"
];

export function CategoryFilter({
  selectedDepartment,
  selectedSemester,
  selectedType,
  selectedAvailability,
  onDepartmentChange,
  onSemesterChange,
  onTypeChange,
  onAvailabilityChange,
  onClearFilters
}: CategoryFilterProps) {
  const hasFilters = selectedDepartment !== "All Departments" ||
                    selectedSemester !== "All Semesters" ||
                    selectedType !== "All Types" ||
                    selectedAvailability !== "Available Only";

  return (
    <div className="bg-white border-b p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
            
            <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={onSemesterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" onClick={onClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedDepartment !== "All Departments" && (
              <Badge variant="secondary">{selectedDepartment}</Badge>
            )}
            {selectedSemester !== "All Semesters" && (
              <Badge variant="secondary">{selectedSemester}</Badge>
            )}
            {selectedType !== "All Types" && (
              <Badge variant="secondary">{selectedType}</Badge>
            )}
            {selectedAvailability !== "Available Only" && (
              <Badge variant="secondary">{selectedAvailability}</Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}