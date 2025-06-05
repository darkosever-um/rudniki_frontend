import Maps from '../modules/Maps';
import NotificationStack from '../modules/NotificationStack';

function Home() {

  return (
    <div className="App">
      <NotificationStack>   
        <Maps/>
      </NotificationStack>
    </div>
  );
}

export default Home;
