import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/Badge";
import { Play, Pause, Square, Clock, Plus, BookOpen, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ReadingTimer = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedBook, setSelectedBook] = useState("");
  const [manualMinutes, setManualMinutes] = useState("");
  const [manualPages, setManualPages] = useState("");
  const [notes, setNotes] = useState("");
  const [todaySessions, setTodaySessions] = useState([
    {
      id: 1,
      book: "아몬드",
      minutes: 25,
      pages: 15,
      notes: "감정에 대한 새로운 관점을 얻었다",
      startTime: "14:30",
      endTime: "14:55"
    },
    {
      id: 2,
      book: "사피엔스",
      minutes: 20,
      pages: 8,
      notes: "허구와 현실의 경계에 대한 흥미로운 내용",
      startTime: "16:00",
      endTime: "16:20"
    }
  ]);

  const books = [
    { id: 1, title: "사피엔스", author: "유발 하라리" },
    { id: 2, title: "아몬드", author: "손원평" },
    { id: 3, title: "코스모스", author: "칼 세이건" },
    { id: 4, title: "1984", author: "조지 오웰" }
  ];

  // 타이머 로직
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedBook) {
      toast({
        title: "오류",
        description: "읽을 책을 선택해주세요",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (seconds === 0) return;
    
    const minutes = Math.floor(seconds / 60);
    const session = {
      id: Date.now(),
      book: selectedBook,
      minutes: minutes,
      pages: parseInt(manualPages) || 0,
      notes: notes,
      startTime: new Date(Date.now() - seconds * 1000).toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      endTime: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    setTodaySessions([session, ...todaySessions]);
    setIsRunning(false);
    setSeconds(0);
    setSelectedBook("");
    setManualPages("");
    setNotes("");
    toast({
      title: "성공",
      description: `${minutes}분 독서 기록이 저장되었습니다!`
    });
  };

  const handleManualAdd = () => {
    if (!selectedBook || !manualMinutes) {
      toast({
        title: "오류",
        description: "책과 시간을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    const session = {
      id: Date.now(),
      book: selectedBook,
      minutes: parseInt(manualMinutes),
      pages: parseInt(manualPages) || 0,
      notes: notes,
      startTime: "수동 입력",
      endTime: "수동 입력"
    };

    setTodaySessions([session, ...todaySessions]);
    setSelectedBook("");
    setManualMinutes("");
    setManualPages("");
    setNotes("");
    toast({
      title: "성공",
      description: "독서 기록이 추가되었습니다!"
    });
  };

  const getTotalStats = () => {
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.minutes, 0);
    const totalPages = todaySessions.reduce((sum, session) => sum + session.pages, 0);
    return { totalMinutes, totalPages };
  };

  const { totalMinutes, totalPages } = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">독서 시간 기록</h1>
            <p className="text-gray-600">오늘 총 {totalMinutes}분, {totalPages}페이지 읽었어요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 타이머 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>타이머</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 책 선택 */}
              <div>
                <Label>읽을 책</Label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">책을 선택하세요</option>
                  {books.map(book => (
                    <option key={book.id} value={book.title}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

              {/* 타이머 디스플레이 */}
              <div className="text-center py-8">
                <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
                  {formatTime(seconds)}
                </div>
                <div className="flex justify-center space-x-2">
                  {!isRunning ? (
                    <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      시작
                    </Button>
                  ) : (
                    <Button onClick={handlePause} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      일시정지
                    </Button>
                  )}
                  <Button onClick={handleStop} variant="destructive" disabled={seconds === 0}>
                    <Square className="h-4 w-4 mr-2" />
                    종료
                  </Button>
                </div>
              </div>

              {/* 추가 정보 입력 */}
              <div className="space-y-3">
                <div>
                  <Label>읽은 페이지 수</Label>
                  <Input
                    type="number"
                    placeholder="페이지 수"
                    value={manualPages}
                    onChange={(e) => setManualPages(e.target.value)}
                  />
                </div>
                <div>
                  <Label>메모</Label>
                  <Textarea
                    placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 수동 입력 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-purple-600" />
                <span>수동 입력</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>읽은 책</Label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">책을 선택하세요</option>
                  {books.map(book => (
                    <option key={book.id} value={book.title}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>읽은 시간 (분)</Label>
                  <Input
                    type="number"
                    placeholder="분"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                  />
                </div>
                <div>
                  <Label>읽은 페이지</Label>
                  <Input
                    type="number"
                    placeholder="페이지"
                    value={manualPages}
                    onChange={(e) => setManualPages(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>메모</Label>
                <Textarea
                  placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleManualAdd} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                기록 추가
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 오늘의 독서 기록 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>오늘의 독서 기록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{session.book}</span>
                      <Badge variant="secondary">{session.minutes}분</Badge>
                      {session.pages > 0 && (
                        <Badge variant="outline">{session.pages}페이지</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {session.startTime} - {session.endTime}
                    </div>
                    {session.notes && (
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReadingTimer;
