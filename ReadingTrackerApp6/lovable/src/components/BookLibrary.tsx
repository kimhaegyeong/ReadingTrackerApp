import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, CheckCircle, Heart, Calendar } from "lucide-react";

const BookLibrary = ({ onBookSelect }) => {
  const [books] = useState([
    {
      id: 1,
      title: "사피엔스",
      author: "유발 하라리",
      status: "completed",
      progress: 100,
      coverColor: "bg-blue-500",
      quotes: 12,
      notes: 8,
      readingTime: "15시간 32분"
    },
    {
      id: 2,
      title: "아몬드",
      author: "손원평",
      status: "reading",
      progress: 65,
      coverColor: "bg-purple-500",
      quotes: 5,
      notes: 3,
      readingTime: "8시간 15분"
    },
    {
      id: 3,
      title: "코스모스",
      author: "칼 세이건",
      status: "want-to-read",
      progress: 0,
      coverColor: "bg-indigo-500",
      quotes: 0,
      notes: 0,
      readingTime: "0분"
    },
    {
      id: 4,
      title: "1984",
      author: "조지 오웰",
      status: "completed",
      progress: 100,
      coverColor: "bg-red-500",
      quotes: 18,
      notes: 12,
      readingTime: "12시간 45분"
    }
  ]);

  // 오늘의 독서 기록 데이터
  const todayReading = {
    totalMinutes: 45,
    totalPages: 23,
    totalNotes: 3,
    sessions: [
      { book: "아몬드", minutes: 25, pages: 15, notes: 2 },
      { book: "사피엔스", minutes: 20, pages: 8, notes: 1 }
    ]
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "want-to-read":
        return { label: "읽고 싶은", icon: Heart, color: "bg-pink-100 text-pink-800" };
      case "reading":
        return { label: "읽는 중", icon: Clock, color: "bg-yellow-100 text-yellow-800" };
      case "completed":
        return { label: "완료", icon: CheckCircle, color: "bg-green-100 text-green-800" };
      default:
        return { label: "알 수 없음", icon: BookOpen, color: "bg-gray-100 text-gray-800" };
    }
  };

  const filterBooksByStatus = (status) => {
    return books.filter(book => book.status === status);
  };

  const BookCard = ({ book }) => {
    const statusInfo = getStatusInfo(book.status);
    const StatusIcon = statusInfo.icon;

    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        onClick={() => onBookSelect(book)}
      >
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* Book Cover */}
            <div className={`w-16 h-20 ${book.coverColor} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
              <BookOpen className="h-8 w-8" />
            </div>
            
            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                {book.status === "reading" && (
                  <span className="text-xs text-gray-500">{book.progress}%</span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>📖 {book.quotes}개 인용문</span>
                <span>📝 {book.notes}개 메모</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar for reading books */}
          {book.status === "reading" && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">내 서재</h2>
        <p className="text-gray-600">지금까지 {books.length}권의 책과 함께했어요</p>
      </div>

      {/* 오늘의 독서 기록 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>오늘의 독서 기록</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 총합 통계 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{todayReading.totalMinutes}</div>
              <div className="text-sm text-gray-600">분</div>
            </div>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{todayReading.totalPages}</div>
              <div className="text-sm text-gray-600">페이지</div>
            </div>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{todayReading.totalNotes}</div>
              <div className="text-sm text-gray-600">노트</div>
            </div>
          </div>

          {/* 세션별 기록 */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">독서 세션</h4>
            {todayReading.sessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span className="font-medium text-gray-800 text-sm">{session.book}</span>
                <div className="flex space-x-4 text-xs text-gray-600">
                  <span>{session.minutes}분</span>
                  <span>{session.pages}페이지</span>
                  <span>{session.notes}노트</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different reading statuses */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="reading">읽는 중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
          <TabsTrigger value="want-to-read">읽고 싶은</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </TabsContent>

        <TabsContent value="reading" className="space-y-4 mt-6">
          {filterBooksByStatus("reading").map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {filterBooksByStatus("completed").map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </TabsContent>

        <TabsContent value="want-to-read" className="space-y-4 mt-6">
          {filterBooksByStatus("want-to-read").map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookLibrary;
