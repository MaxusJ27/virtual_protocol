import { FunctionComponent, ReactNode, MouseEvent } from "react";
import { FaHeart, } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { User } from "../../lib/definitions";
export const Paper = ({ children }: { children: ReactNode }) => {
  return (
    <div className='shadow-md rounded-lg p-6'>
      {children}
    </div>
  );
}


// dispatch from item

export const Item = ({ user }: { user: User }) => {
  return (
    <div className=" w-full rounded-xl bg-cover p-[100px]" style={{  }}>
      <h1 className='text-lg font-semibold'>{user.gender}</h1>
      <h1 className='text-2xl'>{user.name}</h1>
      <h1 className='text-md'>{user.location}</h1>
    </div>
  )
}

type CarouselContainerProps = {
  sliding: boolean;
  dir: 'NEXT' | 'PREV';
  children: React.ReactNode;
};

export const CarouselContainer: React.FC<CarouselContainerProps> = ({ sliding, dir, children }) => {
  const transitionValue = sliding ? "none" : "transform 1s ease-in-out";
  let transformValue: string;
  if (!sliding) {
    transformValue = 'translate-x(calc(-80% - 20px))';
  }
  else if (dir === 'PREV') {
    transformValue = 'translate-x(calc(2 * (-80% - 20px)))';
  }
  else {
    transformValue = 'translate-x(0%)';
  }

  return (
    <div className={`flex h-full ${transitionValue} transform ${transformValue}`}>
      {children}
    </div>
  );
};

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full overflow-hidden shadow-lg'>
      {children}
    </div>
  )
}

export const CarouselSlot = ({ order, children }: { order: number, children: ReactNode}) => {
  return (
    <div className="bg-cover bg-no-repeat" style={{ flex: "1 0 100%", flexBasis: "100%", height: "full", marginRight: "20px", backgroundImage: "url('assets/profile.png')", backgroundSize: "75% 65%", backgroundPosition: "center", order }}>
      {children}
    </div>
  );
}

type SlideButtonProps = {
  float: 'left' | 'right';
  children: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};
export const SlideButton: FunctionComponent<SlideButtonProps> = ({ float, children, onClick }) => {
  return (
    <button
      className={`
        text-black  font-open-sans text-4xl font-light py-2 px-4 border border-black rounded-md shadow-sm inline-block cursor-pointer mt-5 text-decoration-none focus:outline-none ${float === 'right' ? 'float-right' : ''}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

