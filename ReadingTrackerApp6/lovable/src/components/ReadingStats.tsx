
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Share2,
  Award,
  BarChart3
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "@/hooks/use-toast";

const ReadingStats = ({ onBack }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // 목 데이터 (실제로는 localStorage에서 가져올 것)
  const mockData = {
    yearlyGoal: 24,
    booksRead: 18,
    totalMinutes: 1250,
    totalPages: 3200,
    currentStreak: 15,
    longestStreak: 32,
    sessions: [
      { month: '1월', books: 2, minutes: 120, pages: 280 },
      { month: '2월', books: 1, minutes: 80, pages: 180 },
      { month: '3월', books: 3, minutes: 150, pages: 420 },
      { month: '4월', books: 2, minutes: 110, pages: 350 },
      { month: '5월', books: 2, minutes: 140, pages: 380 },
      { month: '6월', books: 3, minutes: 180, pages: 490 },
      { month: '7월', books: 2, minutes: 120, pages: 290 },
      { month: '8월', books: 1, minutes: 90, pages: 220 },
      { month: '9월', books: 2, minutes: 160, pages: 340 },
    ],
    genres: [
      { name: '소설', value: 8, color: '#8B5CF6' },
      { name: '에세이', value: 4, color: '#06B6D4' },
      { name: '과학', value: 3, color: '#10B981' },
      { name: '자기계발', value: 3, color: '#F59E0B' },
    ],
    recentBooks: [
      { title: '아몬드', author: '손원평', finishedDate: '2024-06-15', rating: 5 },
      { title: '사피엔스', author: '유발 하라리', finishedDate: '2024-06-10', rating: 4 },
      { title: '코스모스', author: '칼 세이건', finishedDate: '2024-06-05', rating: 5 },
    ]
  };

  const progressPercentage = (mockData.booksRead / mockData.yearlyGoal) * 100;

  const chartConfig = {
    books: {
      label: "읽은 책",
      color: "#3B82F6",
    },
    minutes: {
      label: "독서 시간",
      color: "#8B5CF6",
    },
  };

  const handleShareStats = () => {
    const statsText = `📚 ${selectedYear}년 독서 현황
✅ 읽은 책: ${mockData.booksRead}/${mockData.yearlyGoal}권
⏰ 총 독서시간: ${Math.floor(mockData.totalMinutes / 60)}시간 ${mockData.totalMinutes % 60}분
📖 총 페이지: ${mockData.totalPages.toLocaleString()}페이지
🔥 현재 연속 독서: ${mockData.currentStreak}일

#독서기록 #리브노트`;

    if (navigator.share) {
      navigator.share({
        title: '나의 독서 통계',
        text: statsText
      });
    } else {
      navigator.clipboard.writeText(statsText);
      toast({
        title: "복사 완료",
        description: "독서 통계가 클립보드에 복사되었습니다."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">독서 통계</h1>
              <p className="text-gray-600">{selectedYear}년 독서 현황을 확인하세요</p>
            </div>
          </div>
          <Button onClick={handleShareStats} className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>공유하기</span>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="charts">차트</TabsTrigger>
            <TabsTrigger value="goals">목표</TabsTrigger>
            <TabsTrigger value="history">기록</TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">읽은 책</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold">{mockData.booksRead}</p>
                        <p className="ml-1 text-sm text-gray-500">/ {mockData.yearlyGoal}권</p>
                      </div>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <Progress value={progressPercentage} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">독서 시간</p>
                      <p className="text-2xl font-bold">{Math.floor(mockData.totalMinutes / 60)}h {mockData.totalMinutes % 60}m</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">현재 연속</p>
                      <p className="text-2xl font-bold">{mockData.currentStreak}일</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">총 페이지</p>
                      <p className="text-2xl font-bold">{mockData.totalPages.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 읽은 책 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 읽은 책</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.recentBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < book.rating ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{book.finishedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 차트 탭 */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 월별 독서량 */}
              <Card>
                <CardHeader>
                  <CardTitle>월별 독서량</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.sessions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="books" fill="var(--color-books)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* 장르 분포 */}
              <Card>
                <CardHeader>
                  <CardTitle>장르별 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.genres}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {mockData.genres.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {mockData.genres.map((genre, index) => (
                      <Badge key={index} variant="outline" style={{ borderColor: genre.color }}>
                        {genre.name}: {genre.value}권
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 목표 탭 */}
          <TabsContent value="goals" className="space-y-6">
            {/* 연간 목표 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>연간 독서 목표</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">목표: {mockData.yearlyGoal}권</span>
                    <Badge variant={progressPercentage >= 100 ? "default" : "secondary"}>
                      {progressPercentage.toFixed(1)}% 달성
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>완료: {mockData.booksRead}권</span>
                    <span>남은 목표: {mockData.yearlyGoal - mockData.booksRead}권</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 도전 과제 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>독서 챌린지</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">연속 독서</span>
                    </div>
                    <p className="text-2xl font-bold">{mockData.currentStreak}일</p>
                    <p className="text-sm text-gray-600">최고 기록: {mockData.longestStreak}일</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">다양한 장르</span>
                    </div>
                    <p className="text-2xl font-bold">{mockData.genres.length}</p>
                    <p className="text-sm text-gray-600">서로 다른 장르</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 기록 탭 */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>연간 독서 회고</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{mockData.booksRead}</p>
                      <p className="text-sm text-gray-600">완독한 책</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{mockData.totalMinutes}</p>
                      <p className="text-sm text-gray-600">총 독서 시간(분)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{mockData.longestStreak}</p>
                      <p className="text-sm text-gray-600">최장 연속 독서(일)</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">월별 성과</h3>
                    <div className="space-y-2">
                      {mockData.sessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{session.month}</span>
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span>📚 {session.books}권</span>
                            <span>⏰ {session.minutes}분</span>
                            <span>📄 {session.pages}페이지</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReadingStats;
