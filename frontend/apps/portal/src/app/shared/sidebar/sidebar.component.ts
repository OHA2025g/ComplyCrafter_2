import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: '📊'
    },
    {
      title: 'Masters',
      icon: '👥',
      expanded: false,
      children: [
        { title: 'Company', route: '/masters/company' },
        { title: 'Directors / KMP', route: '/masters/directors' },
        { title: 'Shareholder', route: '/masters/shareholder' },
        { title: 'Share Certificate', route: '/masters/share-certificate' },
        { title: 'Debenture Holder', route: '/masters/debenture-holder' },
        { title: 'Auditor', route: '/masters/auditor' },
        { title: 'Agenda(s)', route: '/masters/agendas' },
        { title: 'Shareholder Management', route: '/masters/shareholder-management' },
        {
          title: 'Capital Structure',
          expanded: false,
          children: [
            { title: 'Authorized Capital', route: '/masters/capital/authorized' },
            { title: 'Paid-up Capital', route: '/masters/capital/paid-up' },
            { title: 'Share Capital', route: '/masters/capital/share' }
          ]
        }
      ]
    },
    {
      title: 'Meeting',
      icon: '🤝',
      expanded: false,
      children: [
        { title: 'Board Meeting', route: '/meetings/board' },
        { title: 'Annual General Meeting', route: '/meetings/agm' },
        { title: 'Extra Ordinary General Meeting', route: '/meetings/egm' },
        { title: 'Committee Meeting', route: '/meetings/committee' }
      ]
    },
    {
      title: 'Forms',
      icon: '📝',
      expanded: false,
      children: [
        {
          title: 'MCA Version 3',
          expanded: false,
          children: [
            {
              title: 'Charge related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'CHG1', route: '/forms/chg1' },
                { title: 'CHG4', route: '/forms/chg4' },
                { title: 'CHG6', route: '/forms/chg6' },
                { title: 'CHG8', route: '/forms/chg8' },
                { title: 'CHG9', route: '/forms/chg9' }
              ]
            },
            {
              title: 'Deposit related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'DPT3', route: '/forms/dpt3' },
                { title: 'DPT4', route: '/forms/dpt4' }
              ]
            },
            {
              title: 'DIN related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'DIR3', route: '/forms/dir3' },
                { title: 'DIR5', route: '/forms/dir5' },
                { title: 'DIR6', route: '/forms/dir6' },
                { title: 'DIR9', route: '/forms/dir9' },
                { title: 'DIR11', route: '/forms/dir11' },
                { title: 'DIR12', route: '/forms/dir12' }
              ]
            },
            {
              title: 'Nidhi Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'NDH1', route: '/forms/ndh1' },
                { title: 'NDH2', route: '/forms/ndh2' }
              ]
            },
            {
              title: 'Change Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC4', route: '/forms/inc4' },
                { title: 'INC22', route: '/forms/inc22' },
                { title: 'SH7', route: '/forms/sh7' },
                { title: 'MR1', route: '/forms/mr1' }
              ]
            },
            {
              title: 'Informational Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC20A', route: '/forms/inc20a' },
                { title: 'INC28', route: '/forms/inc28' },
                { title: 'PAS2', route: '/forms/pas2' }
              ]
            },
            {
              title: 'Approval Services (ROC)',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC12', route: '/forms/inc12' },
                { title: 'INC24', route: '/forms/inc24' },
                { title: 'STK2', route: '/forms/stk2' }
              ]
            },
            {
              title: 'Approval Services (RD)',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC23', route: '/forms/inc23' }
              ]
            },
            {
              title: 'Compliance Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'MGT14', route: '/forms/mgt14' },
                { title: 'MSC3', route: '/forms/msc3' },
                { title: 'PAS3', route: '/forms/pas3' },
                { title: 'PAS6', route: '/forms/pas6' },
                { title: 'GNL2', route: '/forms/gnl2' },
                { title: 'GNL3', route: '/forms/gnl3' },
                { title: 'SH8', route: '/forms/sh8' },
                { title: 'SH9', route: '/forms/sh9' },
                { title: 'SH11', route: '/forms/sh11' },
                { title: 'MSME', route: '/forms/msme' },
                { title: 'MGT6', route: '/forms/mgt6' },
                { title: 'BEN2', route: '/forms/ben2' }
              ]
            },
            {
              title: 'Annual Filings',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'AOC4', route: '/forms/aoc4' },
                { title: 'AOC4CFS', route: '/forms/aoc4cfs' },
                { title: 'MGT7A', route: '/forms/mgt7a' },
                { title: 'MGT8', route: '/forms/mgt8' },
                { title: 'MGT9', route: '/forms/mgt9' },
                { title: 'ADT1', route: '/forms/adt1' }
              ]
            },
            {
              title: 'Incorporation',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'RUN', route: '/forms/run' },
                { title: 'RUNLLP', route: '/forms/runllp' }
              ]
            },
            {
              title: 'IEPF Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'IEPF2', route: '/forms/iepf2' },
                { title: 'IEPF5', route: '/forms/iepf5' }
              ]
            },
            {
              title: 'LLP Form',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'FORM3', route: '/forms/form3' },
                { title: 'FORM4', route: '/forms/form4' },
                { title: 'FORM5', route: '/forms/form5' },
                { title: 'FORM11', route: '/forms/form11' },
                { title: 'FORM12', route: '/forms/form12' },
                { title: 'FORM15', route: '/forms/form15' },
                { title: 'FORM22', route: '/forms/form22' },
                { title: 'FORM23', route: '/forms/form23' },
                { title: 'FORM24', route: '/forms/form24' },
                { title: 'FORM28', route: '/forms/form28' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'DMS',
      route: '/dms',
      icon: '🗂️'
    }
  ];

  toggleItem(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
}

