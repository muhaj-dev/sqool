import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { type Notice } from "@/types";

const noticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  visibility: z.enum(["parent", "staff", "everyone"]),
  resources: z.array(z.string().url("Must be a valid URL")).default([]),
  expirationDate: z.string(),
  notificationDate: z.string(),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

interface NoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: Notice | null;
  onSave: (notice: Notice) => void;
}

export function NoticeDialog({ open, onOpenChange, notice, onSave }: NoticeDialogProps) {
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      content: "",
      body: "",
      visibility: "everyone",
      resources: [],
      expirationDate: "",
      notificationDate: new Date().toISOString().slice(0, 16),
    },
  });

  useEffect(() => {
    if (notice) {
      // Safe date formatting with null checks
      const formatDateForInput = (dateString: string | Date | undefined | null): string => {
        if (!dateString) return new Date().toISOString().slice(0, 16);

        try {
          const date = typeof dateString === "string" ? new Date(dateString) : dateString;
          if (isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
          return date.toISOString().slice(0, 16);
        } catch {
          return new Date().toISOString().slice(0, 16);
        }
      };

      form.reset({
        title: notice.title || "",
        content: notice.content || "",
        body: notice.body || "",
        visibility: (notice.visibility as "everyone") || "everyone",
        resources: notice.resources || [],
        expirationDate: formatDateForInput(notice.expirationDate),
        notificationDate: formatDateForInput(notice.notificationDate),
      });
    } else {
      form.reset({
        title: "",
        content: "",
        body: "",
        visibility: "everyone",
        resources: [],
        expirationDate: "",
        notificationDate: new Date().toISOString().slice(0, 16),
      });
    }
  }, [notice, form, open]); // Added 'open' to dependencies to reset when dialog opens

  const onSubmit = (data: NoticeFormValues) => {
    const noticeData: any = {
      title: data.title,
      content: data.content,
      body: data.body,
      visibility: data.visibility,
      resources: data.resources,
      expirationDate: new Date(data.expirationDate).toISOString(),
      notificationDate: new Date(data.notificationDate).toISOString(),
      id: notice?._id,
    };
    onSave(noticeData);
  };

  const addResource = () => {
    const currentResources = form.getValues("resources");
    form.setValue("resources", [...currentResources, ""]);
  };

  const removeResource = (index: number) => {
    const currentResources = form.getValues("resources");
    form.setValue(
      "resources",
      currentResources.filter((_, i) => i !== index),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{notice ? "Edit Notice" : "Create Notice"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notice title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Summary)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of the notice"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary that will be displayed in the notice list
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body (Full Details)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full details of the notice"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The complete notice content with all details</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who can see this notice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="parent">Parents Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="everyone">Everyone (Parents & Staff)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="notificationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Resources (URLs)</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addResource}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>
              {form.watch("resources").map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`resources.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="https://example.com/resource" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeResource(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{notice ? "Update" : "Create"} Notice</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
