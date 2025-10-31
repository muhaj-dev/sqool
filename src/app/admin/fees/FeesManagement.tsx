"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, Trash2, Search, Filter, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  getSchoolFees,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  publishFeeStructure, // Add this import
  getAllSessions,
  getAllClasses,
} from "@/utils/api";
import {
  FeeStructure,
  CreateFeeData,
  UpdateFeeData,
  GetFeesParams,
} from "@/types";

// Dynamic breakdown schema - now supports any fee types
const createTermBreakdownSchema = (feeTypes: string[]) => {
  const schema: any = {};
  feeTypes.forEach((feeType) => {
    schema[feeType] = z.number().min(0, `${feeType} must be positive`);
  });
  return z.object(schema);
};

const termSchema = z.object({
  term: z.enum(["first", "second", "third"]),
  amount: z.number().min(0, "Term amount must be positive"),
  breakdown: z.record(z.string(), z.number().min(0)), // Dynamic breakdown
});

const feeSchema = z.object({
  class: z.string().min(1, "Class is required"),
  session: z.string().min(1, "Session is required"),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  terms: z.array(termSchema).min(1, "At least one term is required"),
});

type FeeFormData = z.infer<typeof feeSchema>;

// Default fee types
const DEFAULT_FEE_TYPES = ["tuition", "examination"];

// Helper function to get initial form values
const getInitialFormValues = (): FeeFormData => ({
  class: "",
  session: "",
  totalAmount: 0,
  terms: [
    {
      term: "first" as const,
      amount: 0,
      breakdown: { tuition: 0, excursion: 0 },
    },
  ],
});

export default function FeesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null);
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [currentTerm, setCurrentTerm] = useState<"first" | "second" | "third">(
    "first"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feeTypes, setFeeTypes] = useState<string[]>(DEFAULT_FEE_TYPES);
  const [newFeeType, setNewFeeType] = useState("");
  const { toast } = useToast();

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [feeToPublish, setFeeToPublish] = useState<FeeStructure | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSession, setFilterSession] = useState<string>("all");
  const [limit, setLimit] = useState<number>(20);
  const [skip, setSkip] = useState<number>(0);

  const handlePublishClick = (fee: FeeStructure) => {
    setFeeToPublish(fee);
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    if (!feeToPublish) return;

    setPublishing(true);
    try {
      await publishFeeStructure(feeToPublish._id);
      toast({
        title: "Fee Structure Published",
        description: "Fee structure has been successfully published",
      });
      await fetchFees(); // Refresh the list
      setIsPublishDialogOpen(false);
      setFeeToPublish(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish fee structure",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handlePublishCancel = () => {
    setIsPublishDialogOpen(false);
    setFeeToPublish(null);
  };

  const form = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: getInitialFormValues(),
    mode: "onChange",
  });

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch fees when filters change
  useEffect(() => {
    fetchFees();
  }, [searchQuery, filterClass, filterSession, limit, skip]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [sessionsData, classesData] = await Promise.all([
        getAllSessions(),
        getAllClasses(),
      ]);

      setSessions(sessionsData || []);
      setClasses(classesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch initial data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const params: GetFeesParams = {
        search: searchQuery || undefined,
        class: filterClass !== "all" ? filterClass : undefined,
        session: filterSession !== "all" ? filterSession : undefined,
        limit,
        skip,
      };

      const response = await getSchoolFees(params);
      setFees(response.data.result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fee structures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedTerms = form.watch("terms");
  const watchedTotalAmount = form.watch("totalAmount");

  // Get current term data
  const currentTermData = watchedTerms.find((t) => t.term === currentTerm);
  const currentTermIndex = watchedTerms.findIndex(
    (t) => t.term === currentTerm
  );

  // Force re-render when current term changes by using a key
  const termFormKey = `term-${currentTerm}-${currentTermIndex}`;

  // Auto-calculate term amount and total when breakdown changes
  const calculateTermAmount = (termIndex: number) => {
    const breakdown = form.getValues(`terms.${termIndex}.breakdown`);
    const termTotal = Object.values(breakdown).reduce(
      (sum: number, val) => sum + (Number(val) || 0),
      0
    );

    form.setValue(`terms.${termIndex}.amount`, termTotal, {
      shouldValidate: true,
    });

    // Recalculate total amount
    const allTerms = form.getValues("terms");
    const totalAmount = allTerms.reduce((sum, term) => sum + term.amount, 0);
    form.setValue("totalAmount", totalAmount, { shouldValidate: true });
  };

  // Handle breakdown field changes
  const handleBreakdownChange = (
    termIndex: number,
    field: string,
    value: number
  ) => {
    form.setValue(`terms.${termIndex}.breakdown.${field}`, value, {
      shouldValidate: true,
    });
    calculateTermAmount(termIndex);
  };

  // Add new fee type
  const addFeeType = () => {
    if (!newFeeType.trim()) {
      toast({
        title: "Error",
        description: "Please enter a fee type name",
        variant: "destructive",
      });
      return;
    }

    const formattedFeeType = newFeeType
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (feeTypes.includes(formattedFeeType)) {
      toast({
        title: "Error",
        description: "This fee type already exists",
        variant: "destructive",
      });
      return;
    }

    // Add to fee types
    setFeeTypes((prev) => [...prev, formattedFeeType]);

    // Initialize this fee type for all existing terms with value 0
    const currentTerms = form.getValues("terms");
    const updatedTerms = currentTerms.map((term) => ({
      ...term,
      breakdown: {
        ...term.breakdown,
        [formattedFeeType]: 0,
      },
    }));

    form.setValue("terms", updatedTerms, { shouldValidate: true });
    setNewFeeType("");

    // Recalculate totals
    calculateTermAmount(currentTermIndex);
  };

  // Remove fee type
  const removeFeeType = (feeTypeToRemove: string) => {
    if (feeTypes.length <= 1) {
      toast({
        title: "Error",
        description: "At least one fee type is required",
        variant: "destructive",
      });
      return;
    }

    // Remove from fee types
    setFeeTypes((prev) => prev.filter((type) => type !== feeTypeToRemove));

    // Remove this fee type from all terms
    const currentTerms = form.getValues("terms");
    const updatedTerms = currentTerms.map((term) => {
      const { [feeTypeToRemove]: removed, ...newBreakdown } = term.breakdown;
      return {
        ...term,
        breakdown: newBreakdown,
      };
    });

    form.setValue("terms", updatedTerms, { shouldValidate: true });

    // Recalculate totals
    calculateTermAmount(currentTermIndex);
  };

  const onSubmit = async (data: FeeFormData) => {
    setFormSubmitting(true);
    try {
      if (isEditMode && selectedFee) {
        const updateData: UpdateFeeData = {
          totalAmount: data.totalAmount,
          terms: data.terms,
        };

        await updateFeeStructure(selectedFee._id, updateData);

        toast({
          title: "Fee Structure Updated",
          description: `Successfully updated fee structure`,
        });
      } else {
        const createData = {
          class: data.class,
          session: data.session,
          totalAmount: data.totalAmount,
          terms: data.terms,
        };

        console.log("Creating fee with data:", createData);
        await createFeeStructure(createData);

        toast({
          title: "Fee Structure Created",
          description: `Successfully created fee structure`,
        });
      }

      await fetchFees();
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedFee(null);
      form.reset(getInitialFormValues());
      setFeeTypes(DEFAULT_FEE_TYPES); // Reset to default fee types
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} fee structure`,
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setIsEditMode(true);

    // Extract all unique fee types from the fee structure
    const allFeeTypes = new Set<string>();
    fee?.terms?.forEach((term) => {
      Object.keys(term?.breakdown).forEach((key) => {
        allFeeTypes.add(key);
      });
    });

    setFeeTypes(Array.from(allFeeTypes));

    const formData = {
      class: typeof fee?.class === "string" ? fee?.class : fee?.class?._id,
      session:
        typeof fee?.session === "string"
          ? fee?.session
          : (fee?.session as any)._id,
      totalAmount: fee.totalAmount,
      terms: fee.terms,
    };

    console.log("Editing fee with data:", formData);
    form.reset(formData);

    if (fee.terms.length > 0) {
      setCurrentTerm(fee.terms[0].term);
    }

    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedFee(null);
    setIsEditMode(false);
    form.reset(getInitialFormValues());
    setCurrentTerm("first");
    setFeeTypes(DEFAULT_FEE_TYPES); // Reset to default fee types
    setIsDialogOpen(true);
  };

  const handleDelete = async (feeId: string) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) return;

    setIsLoading(true);
    try {
      await deleteFeeStructure(feeId);
      toast({
        title: "Fee Structure Deleted",
        description: "Fee structure has been successfully deleted",
      });
      await fetchFees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fee structure",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Improved term management functions
  const addTerm = (termName: "first" | "second" | "third") => {
    const currentTerms = form.getValues("terms");
    const termExists = currentTerms.find((t) => t.term === termName);

    if (!termExists) {
      // Initialize breakdown with all current fee types set to 0
      const initialBreakdown: Record<string, number> = {};
      feeTypes.forEach((type) => {
        initialBreakdown[type] = 0;
      });

      const newTerm = {
        term: termName,
        amount: 0,
        breakdown: initialBreakdown,
      };

      const updatedTerms = [...currentTerms, newTerm];
      form.setValue("terms", updatedTerms, { shouldValidate: true });

      const totalAmount = updatedTerms.reduce(
        (sum, term) => sum + term.amount,
        0
      );
      form.setValue("totalAmount", totalAmount, { shouldValidate: true });
    }

    setCurrentTerm(termName);
  };

  const removeTerm = (termName: "first" | "second" | "third") => {
    const currentTerms = form.getValues("terms");
    if (currentTerms.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "At least one term is required",
        variant: "destructive",
      });
      return;
    }

    const updatedTerms = currentTerms.filter((t) => t.term !== termName);
    form.setValue("terms", updatedTerms, { shouldValidate: true });

    const totalAmount = updatedTerms.reduce(
      (sum, term) => sum + term.amount,
      0
    );
    form.setValue("totalAmount", totalAmount, { shouldValidate: true });

    if (currentTerm === termName && updatedTerms.length > 0) {
      setCurrentTerm(updatedTerms[0].term);
    }
  };

  // Get available terms that can be added
  const availableTerms = (["first", "second", "third"] as const).filter(
    (term) => !watchedTerms.find((t) => t.term === term)
  );

  // Filtered fees based on search and filters
  const filteredFees = useMemo(() => {
    let filtered = [...fees];

    if (searchQuery.trim()) {
      filtered = filtered.filter((fee) => {
        const className = getClassName(fee);
        const sessionName = getSessionName(fee);

        return (
          className.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sessionName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (filterClass !== "all") {
      filtered = filtered.filter((fee) => {
        const classId =
          typeof fee.class === "string" ? fee.class : fee.class._id;
        return classId === filterClass;
      });
    }

    if (filterSession !== "all") {
      filtered = filtered.filter((fee) => {
        const sessionId =
          typeof fee.session === "string"
            ? fee.session
            : (fee.session as any)._id;
        return sessionId === filterSession;
      });
    }

    return filtered;
  }, [fees, searchQuery, filterClass, filterSession]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterClass("all");
    setFilterSession("all");
    setLimit(20);
    setSkip(0);
  };

  const handleViewDetails = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setIsDetailDialogOpen(true);
  };

  // Helper function to get display name for class
  const getClassName = (fee: FeeStructure) => {
    if (typeof fee.class === "string") {
      const classObj = classes.find((c) => c._id === fee.class);
      return classObj
        ? `${classObj.className} (${classObj.shortName})`
        : fee.class;
    }
    return `${fee.class.className} (${fee.class.shortName})`;
  };

  // Helper function to get display name for session
  const getSessionName = (fee: FeeStructure) => {
    if (typeof fee.session === "string") {
      const sessionObj = sessions.find((s) => s._id === fee.session);
      return sessionObj ? sessionObj.session : fee.session;
    }
    return (fee.session as any).session || "Session";
  };

  // Format classes for dropdown
  const classOptions = classes.map((cls) => ({
    value: cls._id,
    label: `${cls.className} (${cls.shortName})`,
  }));

  // Format sessions for dropdown
  const sessionOptions = sessions.map((session) => ({
    value: session._id,
    label: session.session,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage fee structures for different classes and sessions
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={handleCreateNew}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Create Fee Structure
        </Button>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setIsEditMode(false);
              setSelectedFee(null);
              form.reset(getInitialFormValues());
              setFeeTypes(DEFAULT_FEE_TYPES);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Fee Structure" : "Create Fee Structure"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update the fee structure for the selected class and session."
                  : "Set up fee structure for a class and session. Add fees for each term separately."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classOptions.map((cls) => (
                              <SelectItem key={cls.value} value={cls.value}>
                                {cls.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isEditMode && (
                          <FormDescription className="text-xs">
                            Class cannot be changed during edit
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Session</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select session" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sessionOptions.map((session) => (
                              <SelectItem
                                key={session.value}
                                value={session.value}
                              >
                                {session.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isEditMode && (
                          <FormDescription className="text-xs">
                            Session cannot be changed during edit
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Custom Fee Types Management */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Fee Types</CardTitle>
                    <CardDescription>
                      Add or remove different types of fees. These will be
                      available for all terms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter new fee type (e.g., books, sports, pta)"
                        value={newFeeType}
                        onChange={(e) => setNewFeeType(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addFeeType())
                        }
                      />
                      <Button type="button" onClick={addFeeType}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Type
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {feeTypes.map((feeType) => (
                        <Badge
                          key={feeType}
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {feeType.replace(/_/g, " ")}
                          <button
                            type="button"
                            onClick={() => removeFeeType(feeType)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Term Fees</h3>
                    <div className="flex gap-2 flex-wrap">
                      {(["first", "second", "third"] as const).map((term) => {
                        const termExists = watchedTerms.find(
                          (t) => t.term === term
                        );
                        return (
                          <div key={term} className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                currentTerm === term
                                  ? "default"
                                  : termExists
                                  ? "secondary"
                                  : "outline"
                              }
                              onClick={() =>
                                termExists
                                  ? setCurrentTerm(term)
                                  : addTerm(term)
                              }
                            >
                              {term.charAt(0).toUpperCase() + term.slice(1)}{" "}
                              Term
                              {termExists &&
                                ` - ₦${watchedTerms
                                  .find((t) => t.term === term)
                                  ?.amount.toLocaleString()}`}
                            </Button>
                            {termExists && watchedTerms.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeTerm(term)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Term Button for available terms */}
                  {availableTerms.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Add more terms:
                      </p>
                      <div className="flex gap-2">
                        {availableTerms.map((term) => (
                          <Button
                            key={term}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addTerm(term)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add {term.charAt(0).toUpperCase() +
                              term.slice(1)}{" "}
                            Term
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Term Form - Dynamic Fee Types */}
                  {currentTermData && currentTermIndex !== -1 && (
                    <div key={termFormKey} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {feeTypes.map((feeType) => (
                          <FormField
                            key={feeType}
                            control={form.control}
                            name={`terms.${currentTermIndex}.breakdown.${feeType}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="capitalize">
                                  {feeType.replace(/_/g, " ")} Fee (₦)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={field.value || 0}
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      field.onChange(value);
                                      handleBreakdownChange(
                                        currentTermIndex,
                                        feeType,
                                        value
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                        <p className="text-sm font-medium">
                          {currentTerm.charAt(0).toUpperCase() +
                            currentTerm.slice(1)}{" "}
                          Term Total:
                          <span className="text-primary ml-2 text-lg">
                            ₦{currentTermData.amount.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
                  <p className="text-lg font-bold">
                    Total Annual Fee:
                    <span className="text-primary ml-2 text-2xl">
                      ₦{watchedTotalAmount.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {watchedTerms.length} term(s) configured • {feeTypes.length}{" "}
                    fee type(s)
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setIsEditMode(false);
                      setSelectedFee(null);
                      form.reset(getInitialFormValues());
                      setFeeTypes(DEFAULT_FEE_TYPES);
                    }}
                    disabled={formSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formSubmitting || !form.formState.isValid}
                  >
                    {formSubmitting
                      ? "Saving..."
                      : isEditMode
                      ? "Update Fee Structure"
                      : "Create Fee Structure"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fee Structures</CardTitle>
              <CardDescription>
                View and manage all fee structures across classes and sessions
              </CardDescription>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter Parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by class or session..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Class
                </label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classOptions.map((cls) => (
                      <SelectItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Session Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Session
                </label>
                <Select value={filterSession} onValueChange={setFilterSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessionOptions.map((session) => (
                      <SelectItem key={session.value} value={session.value}>
                        {session.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limit */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Limit
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  placeholder="20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                Clear Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {filteredFees.length} of {fees.length} fee structures
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading fee structures...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Total Amount</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No fee structures found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFees.map((fee) => (
                    <TableRow
                      key={fee._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(fee)}
                    >
                      <TableCell className="font-medium">
                        {getClassName(fee)}
                      </TableCell>
                      <TableCell>{getSessionName(fee)}</TableCell>
                      <TableCell className="font-semibold">
                        ₦{fee.totalAmount.toLocaleString()}
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex flex-col gap-1">
                        
                          <Badge variant={fee.isPublished ? "default" : "outline"}>
                            {fee.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </TableCell> */}
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-2">
                          {!fee.isPublished && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handlePublishClick(fee)}
                              disabled={isLoading}
                              title="Publish Fee Structure"
                              className="gap-1"
                            >
                              <Globe className="w-3 h-3" />
                              Publish
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(fee)}
                            title="Edit Fee Structure"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Fee Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fee Structure Details</DialogTitle>
            <DialogDescription>
              Complete breakdown of fees for{" "}
              {selectedFee && getClassName(selectedFee)} -{" "}
              {selectedFee && getSessionName(selectedFee)}
            </DialogDescription>
          </DialogHeader>

          {selectedFee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-semibold">{getClassName(selectedFee)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Session</p>
                  <p className="font-semibold">{getSessionName(selectedFee)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₦{selectedFee.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Term Breakdown</h3>
                {selectedFee.terms.map((term: any) => (
                  <Card key={term.term}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base capitalize flex items-center justify-between">
                        {term.term} Term
                        <span className="text-lg font-bold">
                          ₦{term.amount.toLocaleString()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object?.entries(term?.breakdown || []).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center border-b pb-2 last:border-0"
                          >
                            <span className="text-sm capitalize text-muted-foreground">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium">
                              ₦{(value as number).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Publish Fee Structure
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this fee structure?
            </DialogDescription>
          </DialogHeader>

          {feeToPublish && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Class:</span>
                  <span className="text-sm">{getClassName(feeToPublish)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Session:</span>
                  <span className="text-sm">
                    {getSessionName(feeToPublish)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-sm font-semibold">
                    ₦{feeToPublish.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-primaryColor/20 border border-primaryColor rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 text-primaryColor flex-shrink-0 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Once published, this fee structure will be visible to
                    parents and students and cannot be unpublished.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePublishCancel}
              disabled={publishing}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={handlePublishConfirm}
              disabled={publishing}
              className=""
            >
              {publishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish Fee Structure
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
