import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Plus, 
  Book, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Globe,
  Lock,
  Calendar,
  Tag,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  source_url?: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_public: boolean;
  priority_score: number;
}

const AIKnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: '',
    source_url: '',
    is_public: true,
    priority_score: 0
  });

  const categories = [
    'City Services',
    'Transportation',
    'Public Safety',
    'Parks & Recreation',
    'Utilities',
    'Housing',
    'Permits & Licenses',
    'Waste Management',
    'Emergency Services',
    'Community Programs'
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('priority_score', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  };

  const handleCreateArticle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create articles",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('knowledge_base').insert({
        ...newArticle,
        tags: newArticle.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author_id: user.id
      });

      if (error) throw error;

      setNewArticle({
        title: '',
        content: '',
        summary: '',
        category: '',
        tags: '',
        source_url: '',
        is_public: true,
        priority_score: 0
      });
      setShowCreateDialog(false);
      loadArticles();

      toast({
        title: "Article created",
        description: "Knowledge base article has been created successfully"
      });
    } catch (error) {
      console.error('Failed to create article:', error);
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive"
      });
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;

    try {
      const { error } = await supabase
        .from('knowledge_base')
        .update({
          title: editingArticle.title,
          content: editingArticle.content,
          summary: editingArticle.summary,
          category: editingArticle.category,
          tags: editingArticle.tags,
          source_url: editingArticle.source_url,
          is_public: editingArticle.is_public,
          priority_score: editingArticle.priority_score
        })
        .eq('id', editingArticle.id);

      if (error) throw error;

      setEditingArticle(null);
      loadArticles();

      toast({
        title: "Article updated",
        description: "Knowledge base article has been updated successfully"
      });
    } catch (error) {
      console.error('Failed to update article:', error);
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive"
      });
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      loadArticles();

      toast({
        title: "Article deleted",
        description: "Knowledge base article has been deleted"
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      });
    }
  };

  const incrementViewCount = async (articleId: string) => {
    try {
      await supabase
        .from('knowledge_base')
        .update({ view_count: articles.find(a => a.id === articleId)?.view_count || 0 + 1 })
        .eq('id', articleId);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-6xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading knowledge base...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            AI Knowledge Base
          </CardTitle>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Article title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newArticle.category}
                    onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    placeholder="Brief summary of the article"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    placeholder="Full article content"
                    rows={8}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="source-url">Source URL (optional)</Label>
                  <Input
                    id="source-url"
                    value={newArticle.source_url}
                    onChange={(e) => setNewArticle({ ...newArticle, source_url: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-public"
                      checked={newArticle.is_public}
                      onChange={(e) => setNewArticle({ ...newArticle, is_public: e.target.checked })}
                    />
                    <Label htmlFor="is-public">Public article</Label>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="priority">Priority Score (0-100)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      max="100"
                      value={newArticle.priority_score}
                      onChange={(e) => setNewArticle({ ...newArticle, priority_score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateArticle}>Create Article</Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      {article.is_public ? (
                        <Globe className="w-3 h-3 text-green-500" />
                      ) : (
                        <Lock className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {article.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      {article.view_count} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        incrementViewCount(article.id);
                        // Open article in modal or navigate to detail view
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingArticle(article)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by creating your first knowledge base article.'
              }
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Create First Article
            </Button>
          </div>
        )}

        {/* Edit Article Dialog */}
        {editingArticle && (
          <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingArticle.category}
                    onValueChange={(value) => setEditingArticle({ ...editingArticle, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-summary">Summary</Label>
                  <Textarea
                    id="edit-summary"
                    value={editingArticle.summary || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    rows={8}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateArticle}>Update Article</Button>
                  <Button variant="outline" onClick={() => setEditingArticle(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AIKnowledgeBase;