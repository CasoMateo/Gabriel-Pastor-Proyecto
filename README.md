# Gabriel-Pastor-Proyecto

**Version 1.0.0**

An effective system to evaluate and control nursing home inventories that uses several statistics to optimize resources.

Users are granted the opportunity to add and update medicines based on real-world usage, with an intuitive infrastructure based on medicine expiry dates.
Medicines are registered in <b> MongoDB </b>, which connects to the <b> React </b> frontend through a <b> FastAPI </b>-based backend. Additional, such as <b> Chartjs </b>, are used 
to display visual statistics about the promixity of future medicines' expiry, thus facilitating **inventory management** in a dynamic way. 

The list of available **medicines** is displayed as follows: 

![image](https://user-images.githubusercontent.com/67202211/178159722-05baaa76-a49b-4694-820f-24d07f3a7a30.png)

with options of addition and consumption (arrival of new packages or usage of past ones) and the capacity to 
add new medicines the add-medicine button in the lower-right corner of the screen. 

**Statistics** with regard to the expiration of available medicines are displayed as follows:

![image](https://user-images.githubusercontent.com/67202211/178160121-69db5879-bc7b-49f5-8bbe-a07406071004.png)
with the dates of each package being featured in the upper part of the screen, and a flexible illustration of 
adequate timelines with green, alerted ones with yellow, and expired ones with red. Options to clear expired packages are provided as well. 

To handle **site access**, admins are given the ability to add or remove existing users to restrict or expand the reach of the application. 

![image](https://user-images.githubusercontent.com/67202211/178168123-1ac45097-6857-4567-a92c-7f3b5e08c250.png)


## Contributors 

- Mateo Caso <https://github.com/CasoMateo>

## License & Copyright

© Mateo Caso
