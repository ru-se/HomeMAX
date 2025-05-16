// メニューボタン

import React, { useState } from 'react'
import ToggleButton from './ToggleButton';
import MenuItems from './MenuItems';


const Menu = () => {

  

  //メニューの展開状態を管理
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-16 flex flex-col-reverse justify-center gap-y-2">
      {/* トグルボタン */}
      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* トグルボタンを押すと展開するメニュー */}
      <MenuItems isOpen={isOpen} />
    </div>
  )
}

export default Menu