
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";

const AddBookDialog = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Manual book form
  const [manualBook, setManualBook] = useState({
    title: "",
    author: "",
    isbn: "",
    pages: ""
  });

  // Mock search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: searchQuery,
          author: "저자명",
          isbn: "9788934942467",
          coverUrl: null,
          publisher: "출판사",
          publishedYear: "2023"
        },
        {
          id: 2,
          title: `${searchQuery} 시리즈`,
          author: "다른 저자",
          isbn: "9788934942468",
          coverUrl: null,
          publisher: "다른 출판사",
          publishedYear: "2022"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFromSearch = (book) => {
    toast.success(`"${book.title}"이(가) 서재에 추가되었습니다!`);
    onOpenChange(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleManualAdd = () => {
    if (!manualBook.title || !manualBook.author) {
      toast.error("제목과 저자는 필수 입력 항목입니다.");
      return;
    }
    
    toast.success(`"${manualBook.title}"이(가) 서재에 추가되었습니다!`);
    onOpenChange(false);
    setManualBook({ title: "", author: "", isbn: "", pages: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>새 책 추가</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">검색해서 추가</TabsTrigger>
            <TabsTrigger value="manual">직접 입력</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="책 제목이나 저자를 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">검색 중...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {searchResults.map((book) => (
                  <Card key={book.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <p className="text-xs text-gray-500">{book.publisher} · {book.publishedYear}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFromSearch(book)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          추가
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">책 제목 *</Label>
                <Input
                  id="title"
                  placeholder="책 제목을 입력하세요"
                  value={manualBook.title}
                  onChange={(e) => setManualBook({...manualBook, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="author">저자 *</Label>
                <Input
                  id="author"
                  placeholder="저자명을 입력하세요"
                  value={manualBook.author}
                  onChange={(e) => setManualBook({...manualBook, author: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="isbn">ISBN (선택)</Label>
                <Input
                  id="isbn"
                  placeholder="ISBN을 입력하세요"
                  value={manualBook.isbn}
                  onChange={(e) => setManualBook({...manualBook, isbn: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="pages">페이지 수 (선택)</Label>
                <Input
                  id="pages"
                  type="number"
                  placeholder="페이지 수를 입력하세요"
                  value={manualBook.pages}
                  onChange={(e) => setManualBook({...manualBook, pages: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleManualAdd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                서재에 추가
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;
