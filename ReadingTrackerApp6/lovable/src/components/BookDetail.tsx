
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, Quote, FileText, Camera, Clock, Share, Tag, X } from "lucide-react";
import { toast } from "sonner";

const BookDetail = ({ book, onBack }) => {
  const [newQuote, setNewQuote] = useState("");
  const [newQuoteMemo, setNewQuoteMemo] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newQuoteTags, setNewQuoteTags] = useState([]);
  const [newNoteTags, setNewNoteTags] = useState([]);
  const [currentQuoteTag, setCurrentQuoteTag] = useState("");
  const [currentNoteTag, setCurrentNoteTag] = useState("");
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Mock data for quotes and notes with tags
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      text: "인간이 다른 동물과 구별되는 점은 허구를 믿을 수 있다는 것이다.",
      memo: "이 부분이 특히 인상깊었다. 허구를 통해 대규모 협력이 가능해진다는 관점이 흥미롭다.",
      page: 45,
      createdAt: "2023-11-01",
      tags: ["철학", "인간의 본질", "허구"]
    },
    {
      id: 2,
      text: "우리는 모두 상상 속의 질서를 믿고 있다.",
      memo: "",
      page: 89,
      createdAt: "2023-11-02",
      tags: ["사회", "질서", "상상"]
    }
  ]);

  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "저자의 관점에서 인류 문명의 발전 과정을 바라보는 시각이 흥미롭다. 특히 농업혁명이 인간에게 미친 영향에 대한 해석이 새로웠다.",
      createdAt: "2023-11-01",
      tags: ["농업혁명", "문명사", "역사적 관점"]
    }
  ]);

  const handleAddQuoteTag = () => {
    if (currentQuoteTag.trim() && !newQuoteTags.includes(currentQuoteTag.trim())) {
      setNewQuoteTags([...newQuoteTags, currentQuoteTag.trim()]);
      setCurrentQuoteTag("");
    }
  };

  const handleAddNoteTag = () => {
    if (currentNoteTag.trim() && !newNoteTags.includes(currentNoteTag.trim())) {
      setNewNoteTags([...newNoteTags, currentNoteTag.trim()]);
      setCurrentNoteTag("");
    }
  };

  const removeQuoteTag = (tagToRemove) => {
    setNewQuoteTags(newQuoteTags.filter(tag => tag !== tagToRemove));
  };

  const removeNoteTag = (tagToRemove) => {
    setNewNoteTags(newNoteTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddQuote = () => {
    if (!newQuote.trim()) return;
    
    const quote = {
      id: Date.now(),
      text: newQuote,
      memo: newQuoteMemo,
      page: Math.floor(Math.random() * 300) + 1,
      createdAt: new Date().toLocaleDateString(),
      tags: [...newQuoteTags]
    };
    
    setQuotes([...quotes, quote]);
    setNewQuote("");
    setNewQuoteMemo("");
    setNewQuoteTags([]);
    setIsQuoteDialogOpen(false);
    toast.success("인용문이 추가되었습니다!");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      content: newNote,
      createdAt: new Date().toLocaleDateString(),
      tags: [...newNoteTags]
    };
    
    setNotes([...notes, note]);
    setNewNote("");
    setNewNoteTags([]);
    setIsNoteDialogOpen(false);
    toast.success("메모가 추가되었습니다!");
  };

  const handleOCR = () => {
    // Simulate OCR functionality
    toast.info("카메라로 텍스트를 인식하는 기능입니다. (시뮬레이션)");
    setNewQuote("OCR로 인식된 텍스트가 여기에 나타납니다.");
    setIsQuoteDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "want-to-read":
        return <Badge className="bg-pink-100 text-pink-800">읽고 싶은</Badge>;
      case "reading":
        return <Badge className="bg-yellow-100 text-yellow-800">읽는 중</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">책 상세</h1>
      </div>

      {/* Book Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-6">
            <div className={`w-24 h-32 ${book.coverColor} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
              <BookOpen className="h-12 w-12" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-lg text-gray-600 mb-3">{book.author}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                {getStatusBadge(book.status)}
                {book.status === "reading" && (
                  <span className="text-sm text-gray-600">{book.progress}% 완료</span>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <p className="font-semibold text-lg text-blue-600">{book.quotes}</p>
                  <p>인용문</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg text-purple-600">{book.notes}</p>
                  <p>메모</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg text-green-600">{book.readingTime}</p>
                  <p>독서 시간</p>
                </div>
              </div>
            </div>
          </div>
          
          {book.status === "reading" && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Quote className="h-4 w-4 mr-2" />
              인용문 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 인용문 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleOCR}
                  className="flex-shrink-0"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  OCR
                </Button>
                <span className="text-sm text-gray-500 self-center">카메라로 텍스트 인식</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">인용문</label>
                <Textarea
                  placeholder="인상 깊었던 구절을 입력하세요..."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">메모 (선택사항)</label>
                <Textarea
                  placeholder="이 인용문에 대한 생각이나 메모를 남겨보세요..."
                  value={newQuoteMemo}
                  onChange={(e) => setNewQuoteMemo(e.target.value)}
                  rows={3}
                />
              </div>
              
              {/* Tag Input for Quotes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">태그</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="태그를 입력하세요..."
                    value={currentQuoteTag}
                    onChange={(e) => setCurrentQuoteTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddQuoteTag()}
                  />
                  <Button type="button" onClick={handleAddQuoteTag} size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {newQuoteTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newQuoteTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeQuoteTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button onClick={handleAddQuote} className="w-full bg-blue-600 hover:bg-blue-700">
                인용문 추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              메모 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 메모 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={5}
              />
              
              {/* Tag Input for Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">태그</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="태그를 입력하세요..."
                    value={currentNoteTag}
                    onChange={(e) => setCurrentNoteTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNoteTag()}
                  />
                  <Button type="button" onClick={handleAddNoteTag} size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {newNoteTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newNoteTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeNoteTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button onClick={handleAddNote} className="w-full bg-purple-600 hover:bg-purple-700">
                메모 추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for Quotes and Notes */}
      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quotes">인용문</TabsTrigger>
          <TabsTrigger value="notes">메모</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4 mt-6">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Quote className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2 italic">"{quote.text}"</p>
                    {quote.memo && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                        <p className="text-sm text-gray-700">{quote.memo}</p>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span>페이지 {quote.page}</span>
                      <span>•</span>
                      <span>{quote.createdAt}</span>
                    </div>
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {quote.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-6">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{note.content}</p>
                    <p className="text-sm text-gray-500 mb-2">{note.createdAt}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookDetail;
