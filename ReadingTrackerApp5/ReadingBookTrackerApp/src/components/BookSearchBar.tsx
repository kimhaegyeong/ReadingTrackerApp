import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Search, BookOpen, Plus } from "lucide-react";
import { toast } from "sonner";

const BookSearch = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
        },
        {
          id: 3,
          title: `완전한 ${searchQuery}`,
          author: "또 다른 저자",
          isbn: "9788934942469",
          coverUrl: null,
          publisher: "새로운 출판사",
          publishedYear: "2021"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddBook = (book) => {
    toast.success(`"${book.title}"이(가) 서재에 추가되었습니다!`);
    onBack();
  };

  const handleManualAdd = () => {
    toast.success("직접 입력으로 책이 추가되었습니다!");
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">책 검색</h1>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex space-x-3">
            <Input
              placeholder="책 제목이나 저자를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 h-12 text-lg"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Manual Add Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleManualAdd}
              className="w-full py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              직접 입력으로 책 추가하기
            </Button>
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">검색 중...</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && !isSearching && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">검색 결과</h2>
              {searchResults.map((book) => (
                <Card key={book.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{book.title}</h3>
                        <p className="text-gray-600 mb-2">{book.author}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          {book.publisher} · {book.publishedYear}
                        </p>
                        <Button
                          onClick={() => handleAddBook(book)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          서재에 추가
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-500">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;
