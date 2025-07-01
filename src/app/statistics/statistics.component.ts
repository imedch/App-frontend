import { Component } from '@angular/core';
import { PostService } from '../service/post-service.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  posts: any[] = [];
  statusCounts: { [key: string]: number } = {};
  selectedGadgetIndex: number | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    const userId = Number(localStorage.getItem('id'));
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.calculateStatusCounts();
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
      }
    });
  }

  calculateStatusCounts(): void {
    this.statusCounts = {};
    for (const post of this.posts) {
      const status = post.status || 'Unknown';
      this.statusCounts[status] = (this.statusCounts[status] || 0) + 1;
    }
  }

  get lastPostName(): string {
    return this.posts.length > 0 ? this.posts[this.posts.length - 1]?.title : '';
  }

  get mostCommonSkill(): string {
    const skillCount: { [key: string]: number } = {};
    for (const post of this.posts) {
      if (post.skills) {
        const skills = post.skills.split(',').map((s: string) => s.trim());
        for (const skill of skills) {
          if (skill) skillCount[skill] = (skillCount[skill] || 0) + 1;
        }
      }
    }
    let maxSkill = '';
    let maxCount = 0;
    for (const skill in skillCount) {
      if (skillCount[skill] > maxCount) {
        maxSkill = skill;
        maxCount = skillCount[skill];
      }
    }
    return maxSkill || 'N/A';
  }

  get uniqueSkillsCount(): number {
    const skillSet = new Set<string>();
    for (const post of this.posts) {
      if (post.skills) {
        post.skills.split(',').map((s: string) => skillSet.add(s.trim()));
      }
    }
    return skillSet.size;
  }

  get postsThisMonth(): number {
    const now = new Date();
    return this.posts.filter(post => {
      const created = new Date(post.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }

  get mostRecentPostDate(): string {
    if (!this.posts.length) return '';
    const sorted = [...this.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted[0]?.createdAt ? new Date(sorted[0].createdAt).toLocaleString() : '';
  }

  // Add this gadgets array
  get gadgets() {
    return [
      {
        title: 'Total Posts',
        value: this.posts.length,
        icon: '📝',
        color: 'primary',
        details: `You have created ${this.posts.length} posts in total.`
      },
      {
        title: 'Posts This Month',
        value: this.postsThisMonth,
        icon: '📅',
        color: 'success',
        details: `You have created ${this.postsThisMonth} posts this month.`
      },
      {
        title: 'Unique Skills',
        value: this.uniqueSkillsCount,
        icon: '🛠️',
        color: 'info',
        details: `Your posts mention ${this.uniqueSkillsCount} unique skills.`
      },
      {
        title: 'Most Common Skill',
        value: this.mostCommonSkill,
        icon: '⭐',
        color: 'warning',
        details: `The most common skill in your posts is "${this.mostCommonSkill}".`
      },
      {
        title: 'Most Recent Post',
        value: this.mostRecentPostDate,
        icon: '⏰',
        color: 'secondary',
        details: `The most recent post was created on ${this.mostRecentPostDate}.`
      },
      {
        title: 'Last Post Name',
        value: this.lastPostName,
        icon: '🔖',
        color: 'light',
        details: `The last post you created is titled "${this.lastPostName}".`
      },
      {
        title: 'Posts by Status',
        value: '',
        icon: '📊',
        color: 'light', // changed from 'dark' to 'light'
        isStatusList: true
      }
    ];
  }

  toggleGadget(index: number) {
    this.selectedGadgetIndex = this.selectedGadgetIndex === index ? null : index;
  }
}
