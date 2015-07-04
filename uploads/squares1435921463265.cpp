#include <iostream>


using namespace std;

int main()
{

	int t, n , x;
	while(true)
	{
	cin>>t;
	if( t == 0)
		return 0;
	else
	
	{
		n = 0;
		
		//if( x == 0)
		//	return 0;
		//else
		{
			while(t != 0)
			{
				n = n + (t*t);
				
				t--;
			}
		    cout<<n<<endl;
		}
	}} 	
	//return 0;
}