import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  title: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
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
              children: [
                { title: 'DPT3', route: '/forms/dpt3' },
                { title: 'DPT4', route: '/forms/dpt4' }
              ]
            },
            {
              title: 'DIN related forms',
              expanded: false,
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
              title: 'Compliance Services',
              expanded: false,
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
                { title: 'MGT6', route: '/forms/mgt6' },
                { title: 'BEN2', route: '/forms/ben2' }
              ]
            },
            {
              title: 'Annual Filings',
              expanded: false,
              children: [
                { title: 'AOC4', route: '/forms/aoc4' },
                { title: 'MGT7A', route: '/forms/mgt7a' },
                { title: 'MGT8', route: '/forms/mgt8' },
                { title: 'MGT9', route: '/forms/mgt9' },
                { title: 'ADT1', route: '/forms/adt1' }
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
  ]);

  const toggleItem = (item: MenuItem) => {
    const updateItems = (items: MenuItem[]): MenuItem[] => {
      return items.map(i => {
        if (i === item) {
          return { ...i, expanded: !i.expanded };
        }
        if (i.children) {
          return { ...i, children: updateItems(i.children) };
        }
        return i;
      });
    };
    setMenuItems(updateItems(menuItems));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!item.children && item.route) {
      return (
        <NavLink
          key={item.title}
          to={item.route}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon || '📄'}</span>
          <span className="nav-text">{item.title}</span>
        </NavLink>
      );
    }

    if (item.children) {
      return (
        <div key={item.title} className="nav-item">
          <div className="nav-link" onClick={() => toggleItem(item)}>
            <span className="nav-icon">{item.icon || '📄'}</span>
            <span className="nav-text">{item.title}</span>
            <span className="nav-arrow">{item.expanded ? '▼' : '▶'}</span>
          </div>

          {item.expanded && (
            <div className="nav-submenu expanded">
              {item.children.map((child) => (
                <div key={child.title} className="nav-subitem">
                  {renderMenuItem(child, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" className="sidebar-logo" />
        <h3>Comply Crafter</h3>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.title}>{renderMenuItem(item)}</div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;



