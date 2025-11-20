// components/class-management/ResourceManagement.tsx

// interface ResourceManagementProps {
//   classes: Class[];
//   setClasses: (classes: Class[]) => void;
// }

const ResourceManagement = () => {
  // const ResourceManagement = ({ classes, setClasses }: ResourceManagementProps) => {
  // const [selectedClass, setSelectedClass] = useState<string>('');
  // const [showAddResourceDialog, setShowAddResourceDialog] = useState(false);
  // const [newResource, setNewResource] = useState<ResourceFormData>({
  //   title: '',
  //   description: '',
  //   url: '',
  //   type: 'other',
  // });

  // const handleAddResource = () => {
  //   if (!selectedClass || !newResource.title || !newResource.url) {
  //     console.error('Missing required fields');
  //     return;
  //   }

  //   const resource: Resource = {
  //     id: Date.now().toString(),
  //     ...newResource,
  //   };

  //   setClasses(
  //     classes.map(cls =>
  //       cls.id === selectedClass
  //         ? { ...cls, resources: [...cls.resources, resource] }
  //         : cls
  //     )
  //   );

  //   setNewResource({ title: '', description: '', url: '', type: 'other' });
  //   setShowAddResourceDialog(false);
  // };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Coming Soon</h3>

        {/* <div>
          <h3 className="text-lg font-medium">Class Resources</h3>
          <p className="text-gray-600">Manage learning resources for each class</p>
        </div> */}

        {/* <Dialog open={showAddResourceDialog} onOpenChange={setShowAddResourceDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Class Resource</DialogTitle>
              <DialogDescription>
                Add a learning resource with URL link
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Select Class</Label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Resource Title *</Label>
                <Input
                  placeholder="e.g., Mathematics Syllabus"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the resource"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                />
              </div>

              <div>
                <Label>Resource URL *</Label>
                <Input
                  placeholder="https://example.com/resource.pdf"
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Resource Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) => setNewResource({...newResource, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddResource} 
                className="w-full"
                disabled={!selectedClass || !newResource.title || !newResource.url}
              >
                Add Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>

      {/* <div className="space-y-6">
        {classes.map(cls => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                {cls.name} Resources
              </CardTitle>
              <CardDescription>
                Learning resources for this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cls.resources.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No resources added yet
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cls.resources.map(resource => (
                    <div
                      key={resource.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {resource.description}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {resourceTypes.find(t => t.value === resource.type)?.label}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                          >
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setClasses(
                                classes.map(c => 
                                  c.id === cls.id
                                    ? { 
                                        ...c, 
                                        resources: c.resources.filter(r => r.id !== resource.id) 
                                      }
                                    : c
                                )
                              )}
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
};

export default ResourceManagement;
