import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  events: TimelineEvent[] = [
    {
      year: '2024',
      title: 'The Battle is God’s',
      description: '“Do not be afraid or discouraged because of this vast army. For the battle is not yours, but God’s.” (2 Chronicles 20:15)'
    },
    {
      year: '2023',
      title: 'Don’t Give Up – Look Up and Live Up',
      description: '“Let us not grow weary of doing good, for in due season we will reap, if we do not give up.” (Galatians 6:9)'
    },
    {
      year: '2022',
      title: 'Fear Not',
      description: '“Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee…” (Isaiah 41:10)'
    },
    {
      year: '2021',
      title: 'God: Our Refuge, Strength, and Help',
      description: '“God is our refuge and strength, a very present help in trouble.” (Psalm 46:1)'
    },
    {
      year: '2020',
      title: 'Trust and Commit Your Way to the Lord',
      description: '“Commit your way to the Lord; trust also in Him, and He shall bring it to pass.” (Psalm 37:5)'
    },
    {
      year: '2019',
      title: 'Nothing Shall Be Impossible With God',
      description: '“For with God nothing shall be impossible.” (Luke 1:37)'
    },
    {
      year: '2018',
      title: 'Where God Guides, He Provides',
      description: '“The LORD shall guide thee continually… and thou shalt be like a watered garden.” (Isaiah 58:11)'
    },
    {
      year: '2017',
      title: 'Be Still and Know That I Am God',
      description: '“Be still, and know that I am God...” (Psalm 46:10)'
    },
    {
      year: '2016',
      title: 'Abide in Me, Bear Much Fruit',
      description: 'Abiding in Christ produces fruit, for without Him we can do nothing. (Summary of John 15:1–5)'
    },
    {
      year: '2015',
      title: 'Do As to the Lord, Not Men',
      description: '“Whatever you do, do it heartily, as to the Lord, and not unto men.” (Colossians 3:23)'
    },
    {
      year: '2014',
      title: 'Do Everything With Love',
      description: '“Let all your things be done with charity.” (1 Corinthians 16:14)'
    },
    {
      year: '2013',
      title: 'I Can Do All Things Through Christ',
      description: '“I can do all things through Christ which strengtheneth me.” (Philippians 4:13)'
    },
    {
      year: '2012',
      title: 'Be Ye Ready for Jesus',
      description: '“Behold, I come quickly; and my reward is with me…” (Revelation 22:12)'
    },
    {
      year: '2011',
      title: 'Be Equipped for Warfare',
      description: 'Put on the armor of God. (Summary of Ephesians 6:10–18)'
    },
    {
      year: '2010',
      title: 'Fixing Our Eyes on Jesus',
      description: '“Looking unto Jesus, the author and finisher of our faith…” (Hebrews 12:2)'
    },
    {
      year: '2009',
      title: 'Live Christ, Die Gain',
      description: '“For me to live is Christ, and to die is gain.” (Philippians 1:21)'
    },
    {
      year: '2008',
      title: 'Jars of Clay',
      description: '“We have this treasure in earthen vessels…” (2 Corinthians 4:7)'
    },
    {
      year: '2007',
      title: 'Ambassadors for Christ',
      description: '“Now then we are ambassadors for Christ…” (2 Corinthians 5:20)'
    },
    {
      year: '2006',
      title: 'Harvest Plenty, Workers Few',
      description: '“The harvest truly is great, but the labourers are few…” (Luke 10:2)'
    }
  ];
}
