
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Quote, FileText, Target, Award, Settings } from "lucide-react";

const UserProfile = () => {
  const userStats = {
    totalBooks: 15,
    completedBooks: 8,
    readingBooks: 2,
    wantToReadBooks: 5,
    totalReadingTime: "127시간 32분",
    totalQuotes: 45,
    totalNotes: 28,
    currentStreak: 12
  };

  const recentAchievements = [
    { id: 1, title: "첫 번째 완독", icon: "🏆", date: "2023-10-15" },
    { id: 2, title: "10권 돌파", icon: "📚", date: "2023-10-28" },
    { id: 3, title: "꾸준한 독서", icon: "🔥", date: "2023-11-01" }
  ];

  const monthlyGoal = {
    target: 3,
    current: 1,
    percentage: 33
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">독서 여정</h2>
              <p className="text-blue-100">지식과 함께 성장하는 중</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  🔥 {userStats.currentStreak}일 연속
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Goal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">이번 달 목표</CardTitle>
          <Target className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {monthlyGoal.current} / {monthlyGoal.target}권
              </span>
              <span className="text-sm text-gray-600">{monthlyGoal.percentage}% 달성</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${monthlyGoal.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              목표까지 {monthlyGoal.target - monthlyGoal.current}권 남았어요!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalBooks}</p>
            <p className="text-sm text-gray-600">총 책 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalReadingTime}</p>
            <p className="text-sm text-gray-600">총 독서 시간</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Quote className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalQuotes}</p>
            <p className="text-sm text-gray-600">인용문</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalNotes}</p>
            <p className="text-sm text-gray-600">메모</p>
          </CardContent>
        </Card>
      </div>

      {/* Reading Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>독서 현황</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">완료한 책</span>
              <Badge className="bg-green-100 text-green-800">{userStats.completedBooks}권</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">읽는 중</span>
              <Badge className="bg-yellow-100 text-yellow-800">{userStats.readingBooks}권</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">읽고 싶은</span>
              <Badge className="bg-pink-100 text-pink-800">{userStats.wantToReadBooks}권</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>최근 달성</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Button */}
      <Button variant="outline" className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        설정
      </Button>
    </div>
  );
};

export default UserProfile;
