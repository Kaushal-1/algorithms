
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { searchBlogs } from '@/services/blogService';
import { BlogWithAuthor } from '@/types/Blog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';

interface BlogSearchProps {
  variant?: 'inline' | 'modal';
}

const BlogSearch: React.FC<BlogSearchProps> = ({ variant = 'inline' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  // Function to handle search
  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchBlogs(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search when debounced term changes
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Navigate to selected blog
  const handleSelectBlog = (blogId: string) => {
    navigate(`/blogs/${blogId}`);
    setSearchQuery('');
    setModalOpen(false);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Modal search component
  if (variant === 'modal') {
    return (
      <>
        <Button 
          variant="outline" 
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12"
          onClick={() => setModalOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline-flex">Search blogs...</span>
          <span className="inline-flex sm:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <CommandDialog open={modalOpen} onOpenChange={setModalOpen}>
          <CommandInput 
            placeholder="Search blogs..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Searching...' : 'No results found.'}
            </CommandEmpty>
            <CommandGroup heading="Blogs">
              {searchResults.map((blog) => (
                <CommandItem 
                  key={blog.id} 
                  onSelect={() => handleSelectBlog(blog.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{blog.title}</span>
                    <span className="text-xs text-muted-foreground">
                      by {blog.author.username}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {searchResults.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem 
                    onSelect={() => navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    View all results
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </CommandDialog>
      </>
    );
  }

  // Inline search component
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blogs..."
          className="pl-9 pr-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isLoading && (
        <div className="mt-2 text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
};

export default BlogSearch;
